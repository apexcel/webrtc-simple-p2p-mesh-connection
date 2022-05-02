import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Connections } from "../../@types";
import SPC from "../lib/SimplePeerConnection";
import socket from "../lib/socket";
import { localStreamAtom } from "../recoil/atoms";
import useLocalStream from "./useLocalStream";

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
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ]
};

const usePeerConnection = () => {
    const [connections, setConnections] = useState<Connections>(new Map());
    const [isIncomer, setIncomer] = useState(false);
    const localStream = useRecoilValue(localStreamAtom);

    const addPeers = (users: Record<string, string>) => {
        const ret: Connections = new Map()
        Object.entries(users).forEach(([sid, username]) => {
            ret.set(sid, {
                pc: new RTCPeerConnection(pcConfig),
                stream: null,
                username
            })
        })
        setConnections(prev => {
            const next = new Map([...prev, ...ret]);
            return next;
        })
    }

    const addPeer = (sid: string, username: string) => {
        setConnections(prev => {
            const next = new Map(prev);
            next.set(sid, {
                pc: new RTCPeerConnection(pcConfig),
                stream: null,
                username
            });
            return next;
        })
    }

    const createPeerConnection = () => {
        try {
            console.log('createPeerConnection')
            connections.forEach(({ pc }, sid) => {
                if (localStream instanceof MediaStream && connections.has(sid)) {
                    pc.addEventListener('icecandidate', onIceCandidate);
                    pc.addEventListener('track', onTrack);
                    console.log(isIncomer)
                    if (isIncomer) {
                        makeOffer(sid);
                    }
                    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
                }
            });
            setIncomer(false);
        }
        catch (err) {
            console.error('Failed to create RTCPeerConnection:', err)
        }
    }

    const makeOffer = async (sid: string) => {
        try {
            console.log('makeOffer', connections, sid, connections.get(sid));
            if (!connections.has(sid)) return;
            const { pc } = connections.get(sid)!;
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
            console.log('makeAnswer', connections, sid, connections.get(sid));
            if (!connections.has(sid)) return;
            const { pc } = connections.get(sid)!;
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
            connections.forEach((_, sid) => socket.emit('ice-candidate', { receiver: sid, data }))
        }
        else {
            console.log('End of Candidates.')
        }
    }

    const onTrack = (e: RTCTrackEvent) => {
        console.log('onTrack');
        connections.forEach(({ stream }) => {
            stream = e.streams[0]!;
        })
    }

    return {
        isIncomer,
        setIncomer,
        addPeer,
        addPeers,
        connections,
        makeAnswer,
        createPeerConnection
    }
}

export default usePeerConnection;