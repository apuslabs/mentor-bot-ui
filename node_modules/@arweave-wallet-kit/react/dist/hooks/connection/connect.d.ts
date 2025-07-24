/**
 * Connect method hook
 */
export default function useConnect(): () => Promise<void>;
export interface ConnectMsg {
    type: "connect_result";
    res: boolean;
}
