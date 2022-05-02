import { selector } from "recoil";
import { roomIdAtom, usernameAtom } from "./atoms";

export const userSelector = selector({
    key: 'userSelector',
    get: ({ get }) => {
        const username = get(usernameAtom);
        const roomId = get(roomIdAtom);

        return {
            username,
            roomId
        }
    }
})