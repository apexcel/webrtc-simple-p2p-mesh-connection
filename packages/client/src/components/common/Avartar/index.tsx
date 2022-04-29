import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: #c2c2c2;
`;

interface AvatarProps {
    svg: ReactElement
    style?: React.CSSProperties
}

const Avatar = ({
    svg, 
    style
}: AvatarProps) => {
    return (
        <Wrapper style={style}>
            {svg}
        </Wrapper>
    )
};

export default Avatar;