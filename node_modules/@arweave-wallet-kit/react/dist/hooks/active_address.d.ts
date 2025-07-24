/**
 * Active address in the wallet
 */
export default function useAddress(): string | undefined;
export declare function useSyncAddress(): Promise<void>;
/**
 * Public key of the active wallet
 */
export declare function usePublicKey(): string | undefined;
