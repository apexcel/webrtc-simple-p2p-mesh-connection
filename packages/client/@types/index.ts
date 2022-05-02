export type Connection = {
    pc: RTCPeerConnection
    stream: MediaStream | null
    username: string
}

export type Connections = Map<string, Connection>