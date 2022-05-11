import React, { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useLocalStream from '../../../hooks/useLocalStream';
import CircleButton from '../Button/CircleButton';

import PlayCircleIcon from '../../../styles/assets/play-circle.svg'
import PauseCircleIcon from '../../../styles/assets/pause-circle.svg'
import VolumeOnIcon from '../../../styles/assets/volume-on.svg'
import VolumeOffIcon from '../../../styles/assets/volume-off.svg'

const StyledWrapper = styled.div`
    position: relative;
    margin: 0 40px;
    max-width: 480px;
    max-height: 360px;
`;

const StyledBackUpLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 14px;
    background-color: #303030;
    z-index: -1;
`;

const StyledLabel = styled.div`
    position: absolute;
    background: rgba(133, 133, 133, 0.5);
    border-radius: 14px;
    padding: 8px;
    margin: 10px;
`;

const StyledToggleWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px 0;
    text-align: center;

    & button {
        margin: 0 10px;
    }
`;

const StyledVideo = styled.video`
    display: block;
    width: 100%;
    border-radius: 14px;
`;

interface Props {
    stream: MediaStream | null
    label?: string
    uid?: string
    showToggles?: boolean
}

const Video = ({
    stream,
    label,
    uid,
    showToggles = false
}: Props) => {
    const ref = useRef<HTMLVideoElement>(null);
    const {
        toggleAudioTrack,
        toggleVideoTrack,
        toggleState
    } = useLocalStream();

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
    }, [stream]);

    return (
        <StyledWrapper>
            {label ? <StyledLabel>{label}</StyledLabel> : null}
            <StyledVideo
                ref={ref}
                playsInline={true}
                autoPlay={true}
                data-uid={uid}
            />
            <StyledBackUpLayer />
            {
                showToggles && stream
                    ? <StyledToggleWrapper>
                        <CircleButton
                            label={toggleState.audio ? <VolumeOffIcon /> : <VolumeOnIcon />}
                            onClick={toggleAudioTrack}
                            style={{
                                backgroundColor: toggleState.audio ? '#5eb95d' : '#ef5350'
                            }}
                        />
                        <CircleButton
                            label={toggleState.video ? <PauseCircleIcon /> : <PlayCircleIcon />}
                            onClick={toggleVideoTrack}
                            style={{
                                backgroundColor: toggleState.video ? '#5eb95d' : '#ef5350'
                            }}
                        />
                    </StyledToggleWrapper>
                    : null
            }
        </StyledWrapper>
    )
}

export default memo(Video);