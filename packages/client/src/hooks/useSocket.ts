import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import socket from "../lib/socket";
import { localStreamAtom, streamsAtom } from "../recoil/atoms";
import useConnection from "./useConnection";

const useSocket = () => {
    const localStream = useRecoilValue(localStreamAtom);
    const setStreams = useSetRecoilState(streamsAtom);

    const {
        addPeer,
        removePeer,
        createConnection,
        makeAnswer,
        makeOffer,
        connections
    } = useConnection()

    const joinRoom = (roomId: string, username: string) => {
        socket.emit('join', { roomId, username });
    }

    const onSocketJoin = (users: Record<string, string>) => {
        Object.entries(users).forEach(([sid, username]) => addPeer(sid, username));
        Object.entries(users).forEach(([sid, username]) => createConnection(sid));
    }

    const onSocketJoined = ({ sid, username }: { sid: string, username: string }) => {
        addPeer(sid, username);
        createConnection(sid);
        makeOffer(sid);
    }

    const onSocketIceCandidate = ({ sender, data }: { sender: string, data: any }) => {
        connections.current.get(sender)?.pc.addIceCandidate(new RTCIceCandidate({
            sdpMid: data.sdpMid,
            sdpMLineIndex: data.sdpMLineIndex,
            candidate: data.candidate
        }));
        const connectionsArray = Array.from(connections.current).map(([sid, { stream, username }]) => ({ sid, stream, username }));
        setStreams(connectionsArray);
    }

    const onSocketGotOffer = ({ sender, data }: { sender: string, data: any }) => {
        connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
            makeAnswer(sender);
        });
    }

    const onSocketGotAnswer = ({ sender, data }: { sender: string, data: any }) => {
        connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data));
    }

    const onSocketDisconnected = (sid: string) => {
        if (!connections.current.has(sid)) return;
        const { pc, stream } = connections.current.get(sid)!;
        pc.close();
        stream?.getTracks().forEach(track => track.stop());
        removePeer(sid);
        setStreams(prev => prev.filter((pcs) => pcs.sid !== sid));
    }

    const connect = () => {
        useEffect(() => {
            socket.on('join', onSocketJoin)
            socket.on('joined', onSocketJoined)
            return () => {
                socket.off('join', onSocketJoin)
                socket.off('joined', onSocketJoined)
            }
        }, [localStream])

        useEffect(() => {
            socket.on('ice-candidate', onSocketIceCandidate)
            socket.on('have-got-offer', onSocketGotOffer)
            socket.on('have-got-answer', onSocketGotAnswer)
            socket.on('user-exited', onSocketDisconnected)
            // return () => {
            //     socket.off('ice-candidate', onSocketIceCandidate)
            //     socket.off('have-got-offer', onSocketGotOffer)
            //     socket.off('have-got-answer', onSocketGotAnswer)
            //     socket.off('user-exited', onSocketDisconnected)
            // }
        }, [])
    }

    return {
        connect,
        joinRoom,
    }
}

export default useSocket;