import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledCirlceButton = styled.button`
    padding: 4px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 0;
    box-shadow: none;
    background-color: #61b760;
    color: #fff;
    cursor: pointer;
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
    label: string
}

const CircleButton = ({
    label
}: Props) => {
    return (
        <StyledCirlceButton>
            {label}
        </StyledCirlceButton>
    )
};

export default CircleButton;