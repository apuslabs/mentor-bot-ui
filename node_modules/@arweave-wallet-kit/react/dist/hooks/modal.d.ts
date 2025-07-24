/// <reference types="react" />
export default function useModal(defaultOpen?: boolean): {
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    open: boolean;
    bindings: {
        open: boolean;
        onClose: () => void;
    };
};
