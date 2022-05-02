import { useEffect } from "react";
import { useRecoilState } from "recoil";
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
    const [localStream, setLocalStream] = useRecoilState(localStreamAtom)

    useEffect(() => {
        return () => {
            console.log(localStream)
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