import React from 'react';
import styled from 'styled-components';

const Timestamp = styled.span`
    font-size: 0.8rem;
    margin: 0 4px;
`;

interface Props {
    timestamp: number;
}

const Log = ({
    timestamp
}: Props) => {
    return (
        <Timestamp>{new Date(timestamp).toLocaleTimeString()}</Timestamp>
    )
};

export default Log;