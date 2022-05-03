import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { localStreamAtom } from "../recoil/atoms";

const defaultConstraints: MediaStreamConstraints = {
    audio: true,
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: 1.777778
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
    const [localStream, setLocalStream] = useRecoilState(localStreamAtom)

    useEffect(() => {
        return () => {
            localStream?.getTracks().forEach(track => track.stop())
        }
    }, [localStream])

    useEffect(() => {
        getMediaStream(constraints ? constraints : defaultConstraints).then(stream => {
            if (stream) {
                setLocalStream(stream);
            }
        })

        // return () => {
        //     localStream?.getTracks().forEach(track => track.stop())
        // }
    }, [])

    return localStream;
}

export default useLocalStream;