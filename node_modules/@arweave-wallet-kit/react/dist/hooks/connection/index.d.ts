/**
 * Base connection hook
 */
export default function useConnection(): {
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
};
