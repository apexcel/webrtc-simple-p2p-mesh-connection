import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import socket from "../lib/socket";
import { mediaStreamAtom, streamsAtom } from "../recoil/atoms";
import { userSelector } from "../recoil/selectors";
import SPC from '../lib/SimplePeerConnection'

const useSocket = () => {
    const { userName, roomId } = useRecoilValue(userSelector);
    const mediaStream = useRecoilValue(mediaStreamAtom);
    const setStreams = useSetRecoilState(streamsAtom);

    const onSocketJoin = (sids: string[]) => {
        sids.forEach(sid => SPC.addPeer(sid));
        SPC.pcs.forEach((_, sid) => SPC.createPeerConnection(mediaStream, sid));
    }

    const onSocketJoined = async (sid: string) => {
        SPC.addPeer(sid);
        SPC.createPeerConnection(mediaStream, sid);
        SPC.makeOffer(sid);
    }

    const onCandidate = ({ sender, data }: { sender: string, data: any }) => {
        SPC.pcs.get(sender)?.pc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: data.sdpMLineIndex,
            candidate: data.candidate
        }))
        const streams = Array.from(SPC.pcs).map(([_, {stream}]) => stream);
        setStreams(streams);
    }

    const gotOffer = ({ sender, data }: { sender: string, data: any }) => {
        console.log('have got offer')
        SPC.pcs.get(sender)!.pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
            SPC.makeAnswer(sender);
        });
    }

    const gotAnswer = ({ sender, data }: { sender: string, data: any }) => {
        console.log('have got answer')
        SPC.pcs.get(sender)!.pc.setRemoteDescription(new RTCSessionDescription(data));
    }

    const connect = () => {
        useEffect(() => {
            socket.on('ice-candidate', onCandidate)
            socket.on('have-got-offer', gotOffer)
            socket.on('have-got-answer', gotAnswer)
        }, [])

        useEffect(() => {
            socket.on('join', onSocketJoin)
            socket.on('joined', onSocketJoined)

            return () => {
                socket.off('join', onSocketJoin)
                socket.off('joined', onSocketJoined)
            }
        }, [mediaStream])
    }

    const joinRoom = (roomId: string, userName: string) => {
        socket.emit('join', { roomId, userName });
    }

    const sendMessage = (message: string) => {
        socket.emit('message', { userName, roomId, message });
    }

    return {
        connect,
        joinRoom,
    }
}

export default useSocket;