export interface ServerToClientEvents {
    'join': (users: Record<string, string>) => void
    'joined': ({ sid, username }: { sid: string, username: string }) => void
    'ice-candidate': ({ sender, data }: { sender: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'got-offer': ({ sender, data }: { sender: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'got-answer': ({ sender, data }: { sender: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'got-message': (message: string) => void
    'user-exited': (socketId: string) => void
}

export interface ClientToServerEvents {
    'join': ({ roomId, username }: { roomId: string, username: string }) => void
    'ice-candidate': ({ receiver, data }: { receiver: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'offer': ({ receiver, data }: { receiver: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'answer': ({ receiver, data }: { receiver: string, data: RTCIceCandidateInit | RTCSessionDescriptionInit }) => void
    'message': ({ roomId, message }: { roomId: string, message: string }) => void
}