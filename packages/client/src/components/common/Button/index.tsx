import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    border: 1px solid rgba(133, 133, 133, 0.5);
    border-radius: 6px;
    box-shadow: none;
    color: #fff;
    background-color: ${props => props.disabled ? 'gray' : '#274c78'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
    label: string
    disabled?: boolean
}

const Button = ({
    label,
    disabled = false,
    ...props
}: Props) => {
    return (
        <StyledButton disabled={disabled} {...props}>
            {label}
        </StyledButton>
    )
};

export default Button;