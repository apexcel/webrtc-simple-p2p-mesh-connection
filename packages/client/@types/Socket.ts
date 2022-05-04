import { MessageType } from "./Message"

export interface ServerToClientEvents {
    'join': (users: Record<string, string>) => void
    'joined': ({ sid, username }: { sid: string, username: string }) => void
    'ice-candidate': ({ sender, data }: { sender: string, data: RTCIceCandidateInit }) => void
    'got-offer': ({ sender, data }: { sender: string, data: RTCSessionDescriptionInit }) => void
    'got-answer': ({ sender, data }: { sender: string, data: RTCSessionDescriptionInit }) => void
    'got-message': (message: MessageType) => void
    'user-exited': (sid: string) => void
}

export interface ClientToServerEvents {
    'join': ({ roomId, username }: { roomId: string, username: string }) => void
    'ice-candidate': ({ receiver, data }: { receiver: string, data: RTCIceCandidateInit }) => void
    'offer': ({ receiver, data }: { receiver: string, data: RTCSessionDescriptionInit }) => void
    'answer': ({ receiver, data }: { receiver: string, data: RTCSessionDescriptionInit }) => void
    'message': ({ roomId, message }: { roomId: string, message: string }) => void
}