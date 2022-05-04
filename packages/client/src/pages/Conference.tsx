import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Video from '../components/common/Video';
import Message from '../components/Message/Message';
import { localStreamAtom, messagesAtom, streamsAtom, usernameAtom } from '../recoil/atoms';

const StyledLayout = styled.div`
    position: absolute;
    inset: 0;
    background-color: #303030;
`;

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const StyledMain = styled.div`
    display: flex;
    flex: 1;
`;

const StyledStreamsWrapper = styled.div`
    display: flex;
    height: 100%;
    width:100%;
`;

const StyledChatWrapper = styled.div<{ visible: boolean }>`
    position: relative;
    min-width: ${props => props.visible ? '380px' : 0};
    border-radius: 16px;
    background-color: #fff;
    transition: min-width 0.35s ease-in-out;
`;

const StyledMessagesWrapper = styled.div<{ visible: boolean }>`
    flex: 1;
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: ${props => props.visible ? 10 : 0}px;
    transition: padding 0.35s ease-in-out;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const StyledBottomNavigation = styled.div`
    height: 64px;
    background-color: #1a1a1a;
`;

const Conference = () => {
    const [visibleState, setVisibleState] = useState(false);
    const localStream = useRecoilValue(localStreamAtom);
    const streams = useRecoilValue(streamsAtom);
    const username = useRecoilValue(usernameAtom);
    const messages = useRecoilValue(messagesAtom);

    return (
        <StyledLayout>
            <StyledWrapper>
                <StyledMain>
                    <StyledStreamsWrapper>
                        <Video stream={localStream} label={username} />
                        {
                            streams.map(({ stream, sid, username }) => <Video key={sid} stream={stream} label={username} uid={sid} />)
                        }
                    </StyledStreamsWrapper>
                    <StyledChatWrapper visible={visibleState}>
                        <StyledMessagesWrapper visible={visibleState}>
                            {
                                messages.map((data, i) => <Message key={i} {...data} />)
                            }
                            <Input type='text' />
                        </StyledMessagesWrapper>
                    </StyledChatWrapper>
                </StyledMain>
                <StyledBottomNavigation>
                    <Button label='Chat' onClick={() => setVisibleState(prev => !prev)} />
                </StyledBottomNavigation>
            </StyledWrapper>
        </StyledLayout>
    )
};

export default Conference;