import { Socket } from "socket.io-client";
import socket from "./socket";

export interface PC {
    pc: RTCPeerConnection
    stream: MediaStream | null
}

const pcConfig = {
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

class SimplePeerConnection {
    private static _instance: SimplePeerConnection;
    private _pcs: Map<string, PC> = new Map();
    private _socket!: Socket;

    constructor(socket: Socket) {
        if (SimplePeerConnection._instance) return SimplePeerConnection._instance;
        this._socket = socket;
        SimplePeerConnection._instance = this;
    }

    addPeer(sid: string) {
        this._pcs.set(sid, {
            pc: new RTCPeerConnection(pcConfig),
            stream: null
        });
    }

    removePeer(sid: string) {
        this._pcs.delete(sid);
    }

    get pcs() {
        return this._pcs;
    }

    // start(localStream: MediaStream, sid: string) {
    //     if (localStream && localStream instanceof MediaStream) {
    //         this.createPeerConnection(sid);
    //         localStream.getTracks().forEach(track => this._pcs.get(sid)?.pc.addTrack(track, localStream));
    //     }
    // }

    createPeerConnection(localStream: MediaStream, sid: string) {
        try {
            if (localStream && localStream instanceof MediaStream && this._pcs.has(sid)) {
                const { pc } = this._pcs.get(sid)!;
                pc.addEventListener('icecandidate', this.onIceCandidate)
                pc.addEventListener('track', this.onTrack)
                localStream.getTracks().forEach(track => this._pcs.get(sid)!.pc.addTrack(track, localStream));
            }
        }
        catch (err) {
            console.error('Failed to create RTCPeerConnection:', err)
        }
    }

    async makeOffer(sid: string) {
        try {
            if (!this._pcs.has(sid)) return;
            const { pc } = this._pcs.get(sid)!;
            const offer = await pc.createOffer();
            pc.setLocalDescription(offer);
            this._socket.emit('offer', { receiver: sid, data: offer });
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    }

    async makeAnswer(sid: string) {
        try {
            if (!this._pcs.has(sid)) return;
            const { pc } = this._pcs.get(sid)!;
            const answer = await pc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            pc.setLocalDescription(answer);
            this._socket.emit('answer', { receiver: sid, data: answer });
        }
        catch (err) {
            console.trace('Failed to create session description:', err);
        }
    }

    onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
            const data = {
                type: 'candidate',
                sdpMLineIndex: e.candidate.sdpMLineIndex,
                sdpMid: e.candidate.sdpMid,
                candidate: e.candidate.candidate
            };

            this._pcs.forEach((_, sid) => this._socket.emit('ice-candidate', { receiver: sid, data }))
        }
        else {
            console.log('End of Candidates.')
        }
    }

    onTrack = (e: RTCTrackEvent) => {
        this._pcs.forEach(peer => peer.stream! = e.streams[0]);
    }
}

const SPC = new SimplePeerConnection(socket);

export default SPC;