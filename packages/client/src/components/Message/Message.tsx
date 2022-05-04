import React from 'react';
import styled from 'styled-components';
import Avatar from '../common/Avartar';
import Log from './Log';
import User from '../../styles/assets/user.svg'
import { MessageType, TransmissionType } from '../../../@types/Message';

const Wrapper = styled.div`
    display: flex;
`;

const TextBalloon = styled.div<{ transmission: TransmissionType }>`
    padding: 10px;
    margin-top: 6px;
    margin-bottom: 6px;
    margin-left:${props => props.transmission === 'send' ? 'auto' : 0};
    text-align: ${props => props.transmission === 'send' ? 'right' : 'left'};
`;

const TextWrapper = styled.div<{ transmission: TransmissionType }>`
    display: inline-block;
    vertical-align: top;
    max-width: 200px;
    padding: 6px 12px;
    background-color: ${props => props.transmission === 'send' ? '#74ffa869' : '#d8d0f8c9'};
    border-radius: ${props => props.transmission === 'send' ? `12px 0 12px 12px` : `0 12px 12px 12px`};
`;

const Text = styled.div`
    line-break: anywhere;
    text-align: left;
`;

const Speaker = styled.p<{ transmission: TransmissionType }>`
    text-align: ${props => props.transmission === 'send' ? 'right' : 'left'};
    font-weight: 500;
    padding-bottom: 4px;
`;

type Props = Omit<MessageType, 'roomId'>

const MessageAvatar = () => {
    const svg = <User width='32px' height='32px' />;
    return <Avatar svg={svg} style={{ marginTop: '20px' }} />
}

const Message = ({
    transmission,
    sourceUserName,
    text,
    timestamp
}: Props) => {
    return (
        <Wrapper>
            {transmission === 'receive' && <MessageAvatar />}
            <TextBalloon transmission={transmission}>
                <Speaker transmission={transmission}>
                    {transmission === 'send' && <Log timestamp={timestamp} />}
                    {sourceUserName}
                    {transmission === 'receive' && <Log timestamp={timestamp} />}
                </Speaker>
                <TextWrapper transmission={transmission}>
                    <Text>{text}</Text>
                </TextWrapper>
            </TextBalloon>
            {transmission === 'send' && <MessageAvatar />}
        </Wrapper>
    )
};

export default Message;