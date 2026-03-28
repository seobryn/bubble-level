/**
 * Manages step progression for onboarding modal.
 * Pure functions for step navigation logic.
 */

export type StepNavigationState = {
  currentStep: number;
  totalSteps: number;
};

export function createInitialStepState(
  totalSteps: number,
): StepNavigationState {
  return {
    currentStep: 0,
    totalSteps: Math.max(totalSteps, 1),
  };
}

export function getNextStep(state: StepNavigationState): StepNavigationState {
  return {
    ...state,
    currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
  };
}

export function getPreviousStep(
  state: StepNavigationState,
): StepNavigationState {
  return {
    ...state,
    currentStep: Math.max(state.currentStep - 1, 0),
  };
}

export function getStepProgress(state: StepNavigationState): string {
  return `${state.currentStep + 1}/${state.totalSteps}`;
}

export function canGoNext(state: StepNavigationState): boolean {
  return state.currentStep < state.totalSteps - 1;
}

export function canGoPrevious(state: StepNavigationState): boolean {
  return state.currentStep > 0;
}

export function isLastStep(state: StepNavigationState): boolean {
  return state.currentStep === state.totalSteps - 1;
}
