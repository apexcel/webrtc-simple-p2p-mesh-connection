import { useEffect, useState } from "react";
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
    const [localStream, setLocalStream] = useRecoilState(localStreamAtom);
    const [toggleState, setToggleState] = useState({
        audio: false,
        video: false
    });

    useEffect(() => {
        if (localStream && localStream instanceof MediaStream) {
            setToggleState({
                audio: true,
                video: true
            })
        }
    }, [localStream])

    const toggleVideoTrack = () => {
        localStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        setToggleState(prev => ({
            ...prev,
            video: !prev.video
        }))
    }

    const toggleAudioTrack = () => {
        localStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        setToggleState(prev => ({
            ...prev,
            audio: !prev.audio
        }))
    }

    const onMediaStream = () => {
        useEffect(() => {
            return () => {
                localStream?.getTracks().forEach(track => track.stop())
                setToggleState({
                    audio: false,
                    video: false
                });
            }
        }, [localStream])

        useEffect(() => {
            getMediaStream(constraints ? constraints : defaultConstraints).then(stream => {
                if (stream) {
                    setLocalStream(stream);
                    setToggleState({
                        audio: true,
                        video: true
                    });
                }
            })
        }, [])
    }

    return {
        onMediaStream,
        toggleAudioTrack,
        toggleVideoTrack,
        toggleState
    };
}

export default useLocalStream;