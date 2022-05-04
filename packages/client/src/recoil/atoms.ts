import { atom } from "recoil";
import { MessageType } from "../../@types/Message";
import { Connection } from "../../@types/WebRTC";

type Stream = {
    sid: string
} & Omit<Connection, 'pc'>

export const localStreamAtom = atom<MediaStream | null>({
    key: 'localStreamAtom',
    default: null
});

export const usernameAtom = atom<string>({
    key: 'usernameAtom',
    default: ''
});

export const roomIdAtom = atom<string>({
    key: 'roomIdAtom',
    default: ''
});

export const streamsAtom = atom<Stream[]>({
    key: 'streamsAtom',
    default: []
});

export const messagesAtom = atom<Omit<MessageType, 'roomId'>[]>({
    key: 'messagesAtom',
    default: [
        {
            transmission: 'receive',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'send',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'receive',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'send',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'receive',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'send',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'receive',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'send',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'receive',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
        {
            transmission: 'send',
            sourceUserName: 'ss',
            text: 'asdasd',
            timestamp: Date.now()
        },
    ]
})