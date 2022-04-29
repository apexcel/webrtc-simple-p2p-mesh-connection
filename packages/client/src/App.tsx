import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useSocket from './hooks/useSocket';
import Conference from './pages/Conference';
import Landing from './pages/Landing';
import Preparation from './pages/Preparation';
import { userNameAtom } from './recoil/atoms';

const App = () => {

    useEffect(() => {
        document.body.style.margin = '0';
    }, [])

    const userName = useRecoilValue(userNameAtom);
    const socket = useSocket();
    socket.connect();

    return (
        <>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/*' element={userName ? <Conference /> : <Preparation />} />
            </Routes>
        </>
    )
};

export default App;