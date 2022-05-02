import React, { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    position: relative;
    margin: 0 40px;
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
}

const Video = ({
    stream,
    label
}: Props) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.srcObject = stream;
    }, [stream]);

    return (
        <StyledWrapper>
            { label ? <StyledLabel>{label}</StyledLabel> : null }
            <StyledVideo
                ref={ref}
                playsInline={true}
                autoPlay={true}
            />
            <StyledBackUpLayer />
        </StyledWrapper>
    )
}

export default memo(Video);