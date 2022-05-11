import React, { HTMLInputTypeAttribute, KeyboardEvent, SyntheticEvent } from 'react';
import styled from 'styled-components';
import DefaultInput from './DefaultInput';

const StyledWrapper = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    margin: 8px;
`;

interface Props {
    type: Extract<HTMLInputTypeAttribute, 'email' | 'password' | 'text'>
    onChange?: (e: SyntheticEvent) => void
    onKeyUp?: (e: KeyboardEvent) => void
    name?: string
    label?: string
}

const OrnamentInput = ({
    type,
    onChange,
    onKeyUp,
    name = '',
    label = '',
}: Props) => {
    return (
        <StyledWrapper>
            <DefaultInput
                type={type}
                onChange={onChange}
                onKeyUp={onKeyUp}
                name={name}
                label={label}
            />
        </StyledWrapper>
    )
};

export default OrnamentInput;