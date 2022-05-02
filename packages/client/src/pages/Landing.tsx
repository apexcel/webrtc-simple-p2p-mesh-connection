import React, { KeyboardEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { requestCreateNewRoom } from '../api';
import { roomIdAtom, usernameAtom } from '../recoil/atoms';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useSocket from '../hooks/useSocket';
import useInput from '../hooks/useInput';

const StyledMain = styled.div`
    width: 720px;
    text-align: center;
    margin: 0 auto;
`;

const Landing = () => {
    const [form, setForm] = useInput({
        userName: ''
    });
    const disabled = useMemo(() => form.userName.trim() === '', [form]);
    const navigate = useNavigate();
    const socket = useSocket();
    const setRoomId = useSetRecoilState(roomIdAtom);
    const setUserName = useSetRecoilState(usernameAtom);

    const onCreateNewRoom = async () => {
        setUserName(form.userName);
        const roomId = await requestCreateNewRoom();
        socket.joinRoom(roomId, form.userName);
        setRoomId(roomId);
        navigate(roomId);
    }

    const onKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Enter') onCreateNewRoom();
    }

    return (
        <StyledMain>
            <h1>WebRTC Simple P2P Mesh Connection</h1>
            <Input
                type='text'
                name='userName'
                label='Username'
                onChange={setForm}
                onKeyUp={onKeyUp}
            />
            <Button
                label='Create New Room'
                onClick={onCreateNewRoom}
                disabled={disabled}
            />
        </StyledMain>
    )
};

export default Landing;