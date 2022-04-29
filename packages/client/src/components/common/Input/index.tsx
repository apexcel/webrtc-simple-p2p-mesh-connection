import React, { HTMLInputTypeAttribute, KeyboardEvent, SyntheticEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import InputWrapper from './InputWrapper';

const StyledWrapper = styled.div`
    display: inline-flex;
    position: relative;
    padding: 4px;
    border: 1px solid #bebebe;
    border-radius: 6px;
    transition: all 0.25s cubic-bezier(0.75, 0.29, 0.11, 1);
`;

const StyledLabel = styled.label<{ focus: boolean }>`
    position: absolute;
    z-index: 9;
    pointer-events: none;
    user-select: none;
    top: 50%;
    left: 0;
    transform: ${props => props.focus ? 'translate(12px, -36px)' : `translate(18px, -50%)`};
    background-color: ${props => props.focus ? '#fff' : 'transparent'};
    color: ${props => props.focus ? '#274c78' : '#bebebe'};
    transition: all 0.25s cubic-bezier(0.75, 0.29, 0.11, 1);
`;

const StyledInput = styled.input`
    display: block;
    width: 100%;
    outline: none;
    padding: 12px 40px 12px 12px;
    font-size: 16px;
    border: 0;
    z-index: 1;
`;

interface Props {
    type: Extract<HTMLInputTypeAttribute, 'email' | 'password' | 'text'>
    onChange?: (e: SyntheticEvent) => void
    onKeyUp?: (e: KeyboardEvent) => void
    name?: string
    label?: string
}

const Input = ({
    type,
    onChange,
    onKeyUp,
    name = '',
    label = '',
}: Props) => {
    const ref = useRef<HTMLInputElement>(null);

    const [focus, setFocus] = useState(false);

    const onFocus = () => setFocus(true);

    const onBlur = () => {
        if (!ref.current || ref.current.value === '') setFocus(false);
    }

    return (
        <InputWrapper>
            <StyledWrapper>
                <StyledLabel focus={focus}>
                    {label}
                </StyledLabel>
                <StyledInput
                    type={type}
                    name={name}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    ref={ref}
                />
            </StyledWrapper>
        </InputWrapper>
    )
};

export default Input;