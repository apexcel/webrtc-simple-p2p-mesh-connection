import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    margin: 8px;
`;

interface Props {
    children: ReactNode
}

const InputWrapper = ({
    children
}: Props) => {
    return (
        <StyledWrapper>{children}</StyledWrapper>
    )
};

export default InputWrapper;