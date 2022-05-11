import React, { KeyboardEvent, useMemo } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { localStreamAtom, roomIdAtom, usernameAtom } from '../recoil/atoms';
import Video from '../components/common/Video';
import Button from '../components/common/Button';
import { useLocation } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import useInput from '../hooks/useInput';
import OrnamentInput from '../components/common/Input/OrnamentInput';

const StyledLayout = styled.div`
    display: flex;
    height: 540px;
    align-items: center;
    justify-content: center;
`;

const StyledVideoWrapper = styled.div`
`;

const StyledFormWrapper = styled.div`
    text-align: center;
`;

const Preparation = () => {
    const [form, setForm] = useInput({
        userName: ''
    });

    const localStream = useRecoilValue(localStreamAtom);
    const location = useLocation();
    const socket = useSocket();

    const setRoomId = useSetRecoilState(roomIdAtom);
    const setUserName = useSetRecoilState(usernameAtom)
    const disabled = useMemo(() => form.userName.trim() === '', [form]);

    const joinRoom = async () => {
        setUserName(form.userName);
        const roomId = location.pathname.substring(1);
        socket.joinRoom(roomId, form.userName);
        setRoomId(roomId);
    }

    const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Enter') joinRoom();
    }

    return (
        <StyledLayout>
            <StyledVideoWrapper>
                <Video stream={localStream} showToggles/>
            </StyledVideoWrapper>
            <StyledFormWrapper>
                <OrnamentInput
                    type='text'
                    name='userName'
                    label='Username'
                    onChange={setForm}
                    onKeyUp={onKeyUp}
                />
                <Button
                    label='Request Join'
                    onClick={joinRoom}
                    disabled={disabled}
                />
            </StyledFormWrapper>
        </StyledLayout>
    )
};

export default Preparation;