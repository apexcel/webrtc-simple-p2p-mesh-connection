import { atom } from "recoil";

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