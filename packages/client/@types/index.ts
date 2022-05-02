export type Connection = {
    pc: RTCPeerConnection
    stream: MediaStream | null
    username: string
}

export type Connections = Map<string, Connection>

export type Action = {
    type: 'ADD_CONNECTION' | 'ADD_CONNECTIONS' | 'REMOVE_CONNECTION' | 'UPDATE_STREAM',
    payload: {
        type: 'single'
        sid: string
        username?: string
        stream?: MediaStream
    } | {
        type: 'multiple',
        entries: [string, Connection][]
    }

}