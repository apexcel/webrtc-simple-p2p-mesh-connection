import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Video from '../components/common/Video';
import useMediaStream from '../hooks/useMediaStream';
import { streamsAtom } from '../recoil/atoms';

const StyledLayout = styled.div`
    display: flex;
    height: 100vh;
    background-color: #303030;
`;

const StyledVideosWrapper = styled.div`
    flex: 1;
`;

const StyledChatWrapper = styled.div`
    width: 400px;
`;

const StyledMessagesWrapper = styled.div`
    padding: 0 20px;
    width: 400px;
    height: inherit;
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Conference = () => {
    const mediaStream = useMediaStream();
    const streams = useRecoilValue(streamsAtom);

    return (
        <StyledLayout>
            <StyledVideosWrapper>
                <Video stream={mediaStream} />
                {
                    streams.map((stream, i) => <Video key={i} stream={stream!} />)
                }
            </StyledVideosWrapper>
            <StyledChatWrapper>
                <StyledMessagesWrapper>

                </StyledMessagesWrapper>
            </StyledChatWrapper>
        </StyledLayout>
    )
};

export default Conference;