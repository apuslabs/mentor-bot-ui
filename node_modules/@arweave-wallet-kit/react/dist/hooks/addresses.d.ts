/**
 * Addresses added to the wallet
 */
export default function useAddresses(): string[];
/**
 * Nicknames/ANS names for addresses
 */
export declare function useWalletNames(): {
    [addr: string]: string;
};
