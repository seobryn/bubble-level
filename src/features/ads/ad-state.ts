export type AdStatus = "idle" | "loading" | "loaded" | "failed";

export interface AdState {
  status: AdStatus;
  errorCode?: number;
}

export type AdAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS" }
  | { type: "LOAD_FAIL"; errorCode: number }
  | { type: "RESET" };

export const initialAdState: AdState = { status: "idle" };

export function adReducer(state: AdState, action: AdAction): AdState {
  switch (action.type) {
    case "LOAD_START":
      return { status: "loading" };
    case "LOAD_SUCCESS":
      return { status: "loaded" };
    case "LOAD_FAIL":
      return { status: "failed", errorCode: action.errorCode };
    case "RESET":
      return initialAdState;
    default:
      return state;
  }
}
