import { useRef } from "react";
import { useRecoilValue } from "recoil";
import { Connections } from "../../@types";
import socket from "../lib/socket";
import { localStreamAtom } from "../recoil/atoms";

const pcConfig: RTCConfiguration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        }
    ]
};

const useConnection = () => {
    const connections = useRef<Connections>(new Map());
    const localStream = useRecoilValue(localStreamAtom);

    const addPeer = (sid: string, username: string) => {
        connections.current.set(sid, {
            pc: new RTCPeerConnection(pcConfig),
            stream: null,
            username
        })
    }

    const removePeer = (sid: string) => {
        connections.current.delete(sid);
    }

    const createConnection = (sid: string) => {
        try {
            if (localStream instanceof MediaStream && connections.current.has(sid)) {
                const { pc } = connections.current.get(sid)!;
                pc.addEventListener('icecandidate', onIceCandidate)
                pc.addEventListener('track', onTrack)
                localStream.getTracks().forEach(track => connections.current.get(sid)!.pc.addTrack(track, localStream));
            }
        }
        catch (err) {
            console.error('Failed to create RTCPeerConnection:', err)
        }
    }

    const makeOffer = async (sid: string) => {
        try {
            console.log('makeOffer', connections.current, sid, connections.current.get(sid));
            if (!connections.current.has(sid)) return;
            const { pc } = connections.current.get(sid)!;
            const offer = await pc.createOffer();
            pc.setLocalDescription(offer);
            socket.emit('offer', { receiver: sid, data: offer });
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    }

    const makeAnswer = async (sid: string) => {
        try {
            console.log('makeAnswer', connections.current, sid, connections.current.get(sid));
            if (!connections.current.has(sid)) return;
            const { pc } = connections.current.get(sid)!;
            const answer = await pc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            pc.setLocalDescription(answer);
            socket.emit('answer', { receiver: sid, data: answer });
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    }

    const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        console.log('onIceCandidate')
        if (e.candidate) {
            const data = {
                type: 'candidate',
                sdpMLineIndex: e.candidate.sdpMLineIndex,
                sdpMid: e.candidate.sdpMid,
                candidate: e.candidate.candidate
            };
            connections.current.forEach((_, sid) => socket.emit('ice-candidate', { receiver: sid, data }))
        }
        else {
            console.log('End of Candidates.')
        }
    }

    const onTrack = (e: RTCTrackEvent) => {
        console.log('onTrack', e.streams[0]);
        connections.current.forEach(pc => pc.stream! = e.streams[0])
    }

    return {
        addPeer,
        removePeer,
        createConnection,
        makeAnswer,
        makeOffer,
        connections
    }
}

export default useConnection;