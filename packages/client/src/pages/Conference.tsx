import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Video from '../components/common/Video';
import useConnection from '../hooks/useConnection';
import useLocalStream from '../hooks/useLocalStream';
import SPC from '../lib/SimplePeerConnection';
import socket from '../lib/socket';
import { localStreamAtom, pcsAtom, streamsAtom, usernameAtom } from '../recoil/atoms';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #303030;
`;

const StyledVideosWrapper = styled.div`
    display: flex;
    flex: 1;
`;

const StyledStreamWrapper = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
`;

const StyledChatWrapper = styled.div<{ visible: boolean }>`
    flex: 0;
    width: ${props => props.visible ? '400px' : 0};
    background-color: #fff;
    border-radius: 16px;
    transition: width 0.35s ease-in-out;
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

const StyledBottomNavigation = styled.div`
    height: 64px;
    background-color: #1a1a1a;
`;

const StyledTest = styled.div`
    position: relative;
    margin: 0 40px;
`;

const Test = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 14px;
    background-color: green;
`;

const Conference = () => {
    const localStream = useRecoilValue(localStreamAtom);
    const [visibleState, setVisibleState] = useState(false);
    const streams = useRecoilValue(streamsAtom);
    const username = useRecoilValue(usernameAtom);
    const { connections } = useConnection()
    const connectionsArray = Array.from(connections.current);


    return (
        <StyledLayout>
            <StyledVideosWrapper>
                <StyledStreamWrapper>
                    <Video stream={localStream} label={username} />
                    {
                        streams.map(({stream, sid, username}) => <Video key={sid} stream={stream} label={username}/>)
                    }
                </StyledStreamWrapper>
                <StyledChatWrapper visible={visibleState}>
                    <StyledMessagesWrapper>

                    </StyledMessagesWrapper>
                </StyledChatWrapper>
            </StyledVideosWrapper>
            <StyledBottomNavigation>
                <button>Audio</button>
                <button>Video</button>
                <button onClick={() => setVisibleState(prev => !prev)}>Chat</button>
            </StyledBottomNavigation>
        </StyledLayout>
    )
};

export default Conference;