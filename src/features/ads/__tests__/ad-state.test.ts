import {
  adReducer,
  initialAdState,
  type AdAction,
} from "@/features/ads/ad-state";

describe("adReducer", () => {
  it("starts in idle state", () => {
    expect(initialAdState.status).toBe("idle");
    expect(initialAdState.errorCode).toBeUndefined();
  });

  it("transitions to loading on LOAD_START", () => {
    const action: AdAction = { type: "LOAD_START" };

    const nextState = adReducer(initialAdState, action);

    expect(nextState.status).toBe("loading");
  });

  it("transitions to loaded on LOAD_SUCCESS", () => {
    const loadingState = adReducer(initialAdState, { type: "LOAD_START" });

    const nextState = adReducer(loadingState, { type: "LOAD_SUCCESS" });

    expect(nextState.status).toBe("loaded");
    expect(nextState.errorCode).toBeUndefined();
  });

  it("transitions to failed on LOAD_FAIL and stores error code", () => {
    const loadingState = adReducer(initialAdState, { type: "LOAD_START" });

    const nextState = adReducer(loadingState, {
      type: "LOAD_FAIL",
      errorCode: 3,
    });

    expect(nextState.status).toBe("failed");
    expect(nextState.errorCode).toBe(3);
  });

  it("resets to idle on RESET from any state", () => {
    const failedState = adReducer(
      adReducer(initialAdState, { type: "LOAD_START" }),
      { type: "LOAD_FAIL", errorCode: 2 },
    );

    const nextState = adReducer(failedState, { type: "RESET" });

    expect(nextState).toEqual(initialAdState);
  });

  it("returns unchanged state for unknown actions", () => {
    const unknownAction = { type: "UNKNOWN" } as unknown as AdAction;

    const nextState = adReducer(initialAdState, unknownAction);

    expect(nextState).toEqual(initialAdState);
  });
});
