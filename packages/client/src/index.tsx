import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalStyle from './styles/GlobalStyles';

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
        <BrowserRouter>
        <GlobalStyle />
            <App />
        </BrowserRouter>
    </RecoilRoot >
);