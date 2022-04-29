import { selector } from "recoil";
import { roomIdAtom, userNameAtom } from "./atoms";

export const userSelector = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const userName = get(userNameAtom);
        const roomId = get(roomIdAtom);

        return {
            userName,
            roomId
        }
    }
})