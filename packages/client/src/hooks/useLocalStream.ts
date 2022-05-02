import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import SPC from "../lib/SimplePeerConnection";
import { localStreamAtom } from "../recoil/atoms";

const defaultConstraints = {
    audio: true,
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
    }
};

const getMediaStream = async (constraints: MediaStreamConstraints) => {
    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    }
    catch (err) {
        console.error(err);
    }
}

const useLocalStream = (constraints?: MediaStreamConstraints) => {
    // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useRecoilState(localStreamAtom)

    useEffect(() => {
        getMediaStream(constraints ? constraints : defaultConstraints).then(stream => {
            if (stream && !localStream) {
                setLocalStream(stream);
            }
        })

        return () => {
            localStream?.getTracks().forEach(track => track.stop())
        }
    }, [localStream])

    return localStream;
}

export default useLocalStream;