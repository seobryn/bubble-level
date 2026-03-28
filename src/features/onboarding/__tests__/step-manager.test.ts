import {
  canGoNext,
  canGoPrevious,
  createInitialStepState,
  getNextStep,
  getPreviousStep,
  getStepProgress,
  isLastStep,
} from "@/features/onboarding/step-manager";

describe("step-manager", () => {
  it("creates initial step state at step 0", () => {
    const state = createInitialStepState(3);

    expect(state.currentStep).toBe(0);
    expect(state.totalSteps).toBe(3);
  });

  it("advances to next step", () => {
    const state = createInitialStepState(3);

    const nextState = getNextStep(state);

    expect(nextState.currentStep).toBe(1);
    expect(nextState.totalSteps).toBe(3);
  });

  it("prevents advancing beyond last step", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state); // step 1
    state = getNextStep(state); // step 2
    state = getNextStep(state); // attempt step 3

    expect(state.currentStep).toBe(2);
  });

  it("goes to previous step", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state);

    const prevState = getPreviousStep(state);

    expect(prevState.currentStep).toBe(0);
  });

  it("prevents going before first step", () => {
    const state = createInitialStepState(3);

    const prevState = getPreviousStep(state);

    expect(prevState.currentStep).toBe(0);
  });

  it("returns step progress string", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state);

    const progress = getStepProgress(state);

    expect(progress).toBe("2/3");
  });

  it("indicates can go to next step", () => {
    const state = createInitialStepState(3);

    expect(canGoNext(state)).toBe(true);
  });

  it("indicates cannot go next on last step", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state);
    state = getNextStep(state);

    expect(canGoNext(state)).toBe(false);
  });

  it("indicates cannot go previous on first step", () => {
    const state = createInitialStepState(3);

    expect(canGoPrevious(state)).toBe(false);
  });

  it("indicates can go previous after advancing", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state);

    expect(canGoPrevious(state)).toBe(true);
  });

  it("identifies last step correctly", () => {
    let state = createInitialStepState(3);
    state = getNextStep(state);
    state = getNextStep(state);

    expect(isLastStep(state)).toBe(true);
  });

  it("does not identify first step as last", () => {
    const state = createInitialStepState(3);

    expect(isLastStep(state)).toBe(false);
  });
});
