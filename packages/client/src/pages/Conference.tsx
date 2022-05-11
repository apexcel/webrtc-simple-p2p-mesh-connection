import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { MessageType } from '../../@types/Message';
import CircleButton from '../components/common/Button/CircleButton';
import DefaultInput from '../components/common/Input/DefaultInput';
import Video from '../components/common/Video';
import Message from '../components/Message/Message';
import useInput from '../hooks/useInput';
import useSocket from '../hooks/useSocket';
import { localStreamAtom, messagesAtom, roomIdAtom, streamsAtom, usernameAtom } from '../recoil/atoms';

import ChatIcon from '../styles/assets/chat.svg'

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
    padding: 24px 0;
`;

const StyledStreamsWrapper = styled.div`
    display: flex;
    height: 100%;
    width:100%;
`;

const StyledChatWrapper = styled.div<{ visible: boolean }>`
    position: relative;
    min-width: ${props => props.visible ? '380px' : 0};
    margin-right: 24px;
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    background-color: #1a1a1a;
`;

const StyledInputPositioner = styled.div`
    position: sticky;
    padding: 10px;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: #fff;
`;

const Conference = () => {
    const [visibleState, setVisibleState] = useState(false);
    const localStream = useRecoilValue(localStreamAtom);
    const streams = useRecoilValue(streamsAtom);
    const username = useRecoilValue(usernameAtom);
    const roomId = useRecoilValue(roomIdAtom);
    const socket = useSocket();
    const [input, onChange] = useInput<MessageType>({
        transmission: 'send',
        text: '',
        sourceUserName: username,
        roomId,
        timestamp: Date.now()
    });
    
    const [messages, setMessage] = useRecoilState(messagesAtom);
    useEffect(() => {
        console.log(messages)
    }, [messages])


    const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            setMessage(prev => [...prev, input]);
            socket.sendMessage(input);
            (e.target as HTMLInputElement).value = '';
        }
    }

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
                            <StyledInputPositioner>
                                <DefaultInput 
                                    type='text' 
                                    onChange={onChange}
                                    onKeyUp={onKeyUp}
                                    name='text'
                                />
                            </StyledInputPositioner>
                        </StyledMessagesWrapper>
                    </StyledChatWrapper>
                </StyledMain>
                <StyledBottomNavigation>
                    <CircleButton label={<ChatIcon />} onClick={() => setVisibleState(prev => !prev)} />
                    {/* <CircleButton label={} onClick={() => setVisibleState(prev => !prev)} /> */}
                    {/* <CircleButton label={} onClick={() => setVisibleState(prev => !prev)} /> */}
                </StyledBottomNavigation>
            </StyledWrapper>
        </StyledLayout>
    )
};

export default Conference;