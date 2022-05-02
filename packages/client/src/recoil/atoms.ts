import { atom } from "recoil";
import { Connection } from "../lib/SimplePeerConnection";

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

export const streamsAtom = atom<{
    stream: (MediaStream | null)
    sid: string
    username: string
}[]>({
    key: 'streamsAtom',
    default: []
});

export const pcsAtom = atom<Map<string, Connection>>({
    key: 'pcsAtom',
    default: new Map()
})

export const connectionStateAtom = atom<Map<string, Connection>>({
    key: 'connectionStateAtom',
    default: new Map()
})