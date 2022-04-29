import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { mediaStreamAtom } from "../recoil/atoms";

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

const useMediaStream = (constraints?: MediaStreamConstraints) => {
    const [mediaStream, setMediaStream] = useRecoilState(mediaStreamAtom);

    useEffect(() => {
        getMediaStream(constraints ? constraints : defaultConstraints).then(stream => {
            if (stream) {
                setMediaStream(stream);
            }
        })

        return () => {
            mediaStream?.getTracks().forEach(track => track.stop());
        }
    }, [])

    return mediaStream;
}

export default useMediaStream;