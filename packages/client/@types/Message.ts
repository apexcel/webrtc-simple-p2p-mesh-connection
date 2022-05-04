export type TransmissionType = 'send' | 'receive';

export interface MessageType {
    transmission: TransmissionType;
    text: string;
    roomId: string;
    sourceUserName: string;
    timestamp: number;
}