import { atom } from "recoil";

export const mediaStreamAtom = atom<MediaStream>({
    key: 'mediaStreamAtom',
    default: new MediaStream()
});

export const userNameAtom = atom<string>({
    key: 'userNameAtom',
    default: ''
})

export const roomIdAtom = atom<string>({
    key: 'roomIdAtom',
    default: ''
})

export const streamsAtom = atom<(MediaStream | null)[]>({
    key: 'streamsAtom',
    default: []
})