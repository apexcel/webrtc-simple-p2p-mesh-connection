import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledCirlceButton = styled.button`
    padding: 4px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 0;
    box-shadow: none;
    background-color: ${props => props.style?.backgroundColor ?? '#eaeaea'};
    color: #fff;
    cursor: pointer;
`;

interface Props {
    label: string | React.ReactNode
    onClick?: (...args: any) => void
    style?: React.CSSProperties
}

const CircleButton = ({
    label,
    onClick,
    style
}: Props) => {
    return (
        <StyledCirlceButton onClick={onClick} style={style}>
            {label}
        </StyledCirlceButton>
    )
};

export default CircleButton;