import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import socket from "../lib/socket";
import { localStreamAtom, streamsAtom } from "../recoil/atoms";
import useConnection from "./useConnection";
import usePeerConnection from "./usePeerConnection";

const useSocket = () => {
    const localStream = useRecoilValue(localStreamAtom);
    const setStreams = useSetRecoilState(streamsAtom);
    // const {
    //     createPeerConnection,
    //     isIncomer,
    //     setIncomer,
    //     addPeer,
    //     addPeers,
    //     connections,
    //     makeAnswer
    // } = usePeerConnection()

    // useEffect(() => {
    //     createPeerConnection()
    // }, [localStream, connections])

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
        console.log('onSocketJoin data:', users)
        Object.entries(users).forEach(([sid, username]) => addPeer(sid, username));
        Object.entries(users).forEach(([sid, username]) => createConnection(sid));
    }

    const onSocketJoined = ({ sid, username }: { sid: string, username: string }) => {
        console.log('onSocketJoined data:', { sid, username })
        addPeer(sid, username);
        createConnection(sid);
        makeOffer(sid);
    }

    const onSocketIceCandidate = ({ sender, data }: { sender: string, data: any }) => {
        console.log('onSocketIceCandidate data', { sender, data })
        connections.current.get(sender)?.pc.addIceCandidate(new RTCIceCandidate({
            sdpMid: data.sdpMid,
            sdpMLineIndex: data.sdpMLineIndex,
            candidate: data.candidate
        }));
        const connectionsArray = Array.from(connections.current).map(([sid, { stream, username }]) => ({ sid, stream, username }));
        setStreams(connectionsArray);
    }

    const onSocketGotOffer = ({ sender, data }: { sender: string, data: any }) => {
        console.log('onSocketGotOffer data', { sender, data })
        connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
            makeAnswer(sender);
        });
    }

    const onSocketGotAnswer = ({ sender, data }: { sender: string, data: any }) => {
        console.log('onSocketGotAnswer data', { sender, data })
        connections.current.get(sender)?.pc.setRemoteDescription(new RTCSessionDescription(data));
    }

    const onSocketDisconnected = (sid: string) => {
        connections.current.get(sid)?.pc.close();
        connections.current.get(sid)?.stream?.getTracks().forEach(track => track.stop());
        removePeer(sid);
        const connectionsArray = Array.from(connections.current).map(([sid, { stream, username }]) => ({ sid, stream, username }));
        setStreams(connectionsArray);
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
            // }
        }, [])
    }

    return {
        connect,
        joinRoom,
    }
}

export default useSocket;