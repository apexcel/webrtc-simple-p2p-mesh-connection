import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { localStreamAtom, messagesAtom, streamsAtom } from "../recoil/atoms";
import socket from "../lib/socket";
import { ServerToClientEvents } from "../../@types/Socket";
import { Connections } from "../../@types/WebRTC";

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

const useSocket = () => {
    const connections = useRef<Connections>(new Map());
    const localStream = useRecoilValue(localStreamAtom);
    const [streams, setStreams] = useRecoilState(streamsAtom);
    const setMessages = useSetRecoilState(messagesAtom);

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

    const onIceCandidate = useCallback((e: RTCPeerConnectionIceEvent) => {
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
    }, [])

    const onTrack = useCallback((e: RTCTrackEvent, sid: string) => {
        console.log('onTrack', e.streams[0]);
        connections.current.forEach(({ stream }) => {
            stream = e.streams[0];
        });
        const target = connections.current.get(sid);
        setStreams(prev => prev
            .filter(d => d.sid !== sid)
            .concat({
                sid,
                stream: e.streams[0],
                username: target?.username!
            }));
    }, [])

    const createPeerConnection = useCallback((sid: string) => {
        try {
            if (localStream && localStream instanceof MediaStream && connections.current.has(sid)) {
                const { pc } = connections.current.get(sid)!
                pc.addEventListener('icecandidate', onIceCandidate)
                pc.addEventListener('track', e => onTrack(e, sid))
                localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            }
        }
        catch (err) {
            console.error('RTCPeerConnection Failed:', err);
        }
    }, [localStream]);


    const offer = useCallback(async (receiver: string) => {
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
    }, []);

    const answer = useCallback(async (receiver: string) => {
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
    }, []);

    const onSocketJoin: ServerToClientEvents['join'] = async (users) => {
        Object.entries(users).forEach(async ([sid, username]) => {
            addPeer(sid, username);
            createPeerConnection(sid);
            await offer(sid);
        });
    }

    const onSocketJoined: ServerToClientEvents['joined'] = ({ sid, username }) => {
        addPeer(sid, username);
        createPeerConnection(sid);
    }

    const onSocketIceCandidate: ServerToClientEvents['ice-candidate'] = async ({ sender, data }) => {
        console.log('Client ICE candidate')
        await connections.current.get(sender)?.pc.addIceCandidate(new RTCIceCandidate({
            sdpMid: data.sdpMid,
            sdpMLineIndex: data.sdpMLineIndex,
            candidate: data.candidate
        }));
    }

    const onSocketGotOffer: ServerToClientEvents['got-offer'] = async ({ sender, data }) => {
        console.log('Client got offer from', sender, data)
        await connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data));
        await answer(sender);
    }

    const onSocketGotAnswer: ServerToClientEvents['got-answer'] = async ({ sender, data }) => {
        console.log('Client got answer from', sender, data)
        await connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data));
    }

    const onSocketDisconnected: ServerToClientEvents['user-exited'] = (sid) => {
        if (!connections.current.has(sid)) return;
        const { pc } = connections.current.get(sid)!
        console.log('will disconnect', connections.current, pc)
        pc.close();
        removePeer(sid);
        setStreams(prev => prev.filter(stream => stream.sid !== sid));
    }

    const onSocketGotMessage: ServerToClientEvents['got-message'] = (message) => {
        setMessages(prev => [...prev, message]);
    }

    const joinRoom = (roomId: string, username: string) => {
        socket.emit('join', { roomId, username });
    }

    const sendMessage = (roomId: string, message: string) => {
        socket.emit('message', { roomId, message });
    }

    const connect = () => {
        useEffect(() => {
            socket.on('got-answer', onSocketGotAnswer)
            socket.on('got-offer', onSocketGotOffer)
            socket.on('got-message', onSocketGotMessage)
            return () => {
                if (socket) socket.disconnect()
            }
        }, [])

        useEffect(() => {
            socket.on('joined', onSocketJoined)
            return () => {
                socket.off('joined', onSocketJoined)
                // socket.off('user-exited', onSocketDisconnected)
            }
        }, [localStream])

        useEffect(() => {
            socket.on('join', onSocketJoin)
            return () => {
                socket.off('join', onSocketJoin)
            }
        }, [localStream, offer])

        useEffect(() => {
            socket.on('ice-candidate', onSocketIceCandidate)
            socket.on('user-exited', onSocketDisconnected)

            return () => {
                socket.off('ice-candidate', onSocketIceCandidate)
                // socket.off('got-answer', onSocketGotAnswer)
                socket.off('user-exited', onSocketDisconnected)
            }
        })

        useEffect(() => {
            // socket.on('got-offer', onSocketGotOffer)
            return () => {
                // socket.off('got-offer', onSocketGotOffer)
            }
        }, [answer])
    }

    return {
        connect,
        joinRoom,
    }
}

export default useSocket;