import {  useRef } from "react";
import { useRecoilValue } from "recoil";
import { Connections } from "../../@types";
import socket from "../lib/socket";
import { localStreamAtom, streamsAtom } from "../recoil/atoms";

const config: RTCConfiguration = {
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
    const setStreams = useRecoilValue(streamsAtom);

    const addPeer = (sid: string, username: string) => {
        connections.current.set(sid, {
            pc: new RTCPeerConnection(config),
            stream: null,
            username
        });
        console.log('addPeer', connections.current)
    };

    const removePeer = (sid: string) => {
        connections.current.delete(sid);
    };

    const createPeerConnection = (sid: string) => {
        try {
            if (localStream && localStream instanceof MediaStream && connections.current.has(sid)) {
                const { pc } = connections.current.get(sid)!
                pc.addEventListener('icecandidate', onIceCandidate)
                pc.addEventListener('track', onTrack)
                localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            }
        }
        catch (err) {
            console.error('RTCPeerConnection Failed:', err);
        }
    };

    const offer = async (receiver: string) => {
        console.log('do offer', receiver)
        try {
            if (!connections.current.has(receiver)) return;
            const { pc } = connections.current.get(receiver)!;
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(offer);
            socket.emit('offer', { receiver, data: offer });

            console.log(`Offer to ${receiver}`)
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    };

    const answer = async (receiver: string) => {
        console.log('do answer', connections.current.has(receiver))
        try {
            if (!connections.current.has(receiver)) return;
            const { pc } = connections.current.get(receiver)!;
            const answer = await pc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(answer);
            socket.emit('answer', { receiver, data: answer });

            console.log(`Answer to ${receiver}`);
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    };

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
        connections.current.forEach(pcs => {
            if (pcs.stream) {
                pcs.stream = e.streams[0];
            }
        })
    }

    return {
        addPeer,
        removePeer,
        createPeerConnection,
        answer,
        offer,
        connections
    } as const
}

export default useConnection;