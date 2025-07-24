/// <reference types="react" />
export default function useGlobalState(): {
    state: import("../context/faces").GlobalState;
    dispatch: import("react").Dispatch<import("../context/faces").Actions>;
};
