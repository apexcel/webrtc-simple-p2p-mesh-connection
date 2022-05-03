import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Button from '../components/common/Button';
import Video from '../components/common/Video';
import { localStreamAtom, streamsAtom, usernameAtom } from '../recoil/atoms';

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

const Conference = () => {
    const localStream = useRecoilValue(localStreamAtom);
    const [visibleState, setVisibleState] = useState(false);
    const streams = useRecoilValue(streamsAtom);
    const username = useRecoilValue(usernameAtom);

    useEffect(() => {
        console.log(streams)
    }, [streams])

    return (
        <StyledLayout>
            <StyledVideosWrapper>
                <StyledStreamWrapper>
                    <Video stream={localStream} label={username}/>
                    {
                        streams.map(({stream, sid, username}) => <Video key={sid} stream={stream} label={username} uid={sid}/>)
                    }
                </StyledStreamWrapper>
                <StyledChatWrapper visible={visibleState}>
                    <StyledMessagesWrapper>

                    </StyledMessagesWrapper>
                </StyledChatWrapper>
            </StyledVideosWrapper>
            <StyledBottomNavigation>
                <Button label='Chat' onClick={() => setVisibleState(prev => !prev)} />
            </StyledBottomNavigation>
        </StyledLayout>
    )
};

export default Conference;