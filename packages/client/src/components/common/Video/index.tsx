import React, { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';

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

const StyledVideo = styled.video`
    display: block;
    width: 100%;
    border-radius: 14px;
`;

interface Props {
    stream: MediaStream | null
    label?: string
    uid?: string
}

const Video = ({
    stream,
    label,
    uid,
}: Props) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        console.log('Video Component uid:', uid, stream)
        if (ref.current) ref.current.srcObject = stream;
    }, [stream]);

    return (
        <StyledWrapper>
            { label ? <StyledLabel>{label}</StyledLabel> : null }
            <StyledVideo
                ref={ref}
                playsInline={true}
                autoPlay={true}
                data-uid={uid}
            />
            <StyledBackUpLayer />
        </StyledWrapper>
    )
}

export default memo(Video);