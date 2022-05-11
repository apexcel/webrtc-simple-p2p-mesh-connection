import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useLocalStream from './hooks/useLocalStream';
import useSocket from './hooks/useSocket';
import Conference from './pages/Conference';
import Landing from './pages/Landing';
import Preparation from './pages/Preparation';
import { usernameAtom } from './recoil/atoms';

const App = () => {
    const userName = useRecoilValue(usernameAtom);
    useLocalStream().onMediaStream();
    useSocket().connect();

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