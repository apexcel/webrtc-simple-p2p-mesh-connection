import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledInputOrnamentPositioner = styled.div<InputOrnamentProps>`
    position: absolute;
    height: 20px;
    width: 20px;
    top: 50%;
    ${props => props.position === 'start' ? `left: 6px` : `right: 10px`};
    transform: translateY(-50%);
    cursor: pointer;
    border: 0;

    & svg {
        width: inherit;
        height: inherit;
        fill: ${props => props.style ? props.style.fill : '#bebebe'};

        path {
            stroke: ${props => props.style ? props.style.stroke : '#bebebe'};
        }
    }
`;

export interface InputOrnamentProps extends HTMLAttributes<HTMLDivElement> {
    position: 'start' | 'end'
}

const InputOrnament = ({
    position,
    ...props
}: InputOrnamentProps) => {
    return (
        <StyledInputOrnamentPositioner
            position={position}
            {...props}
        />
    )
};

export default InputOrnament;