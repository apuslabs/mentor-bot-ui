import type { Actions, GlobalState } from "./faces";
import { Dispatch } from "react";
export declare const defaultState: GlobalState;
declare const context: import("react").Context<{
    state: GlobalState;
    dispatch: Dispatch<Actions>;
}>;
export default context;
