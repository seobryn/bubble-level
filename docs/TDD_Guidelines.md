# TDD Guidelines

This document captures practical best practices for Test-Driven Development (TDD), including how to work effectively with an AI coding assistant.

## 1. Core TDD Principles

- Write tests before production code.
- Keep cycles short: Red -> Green -> Refactor.
- Add only enough code to pass the current test.
- Let tests drive design, not the other way around.
- Prefer many small tests over a few large ones.

## 2. The Red -> Green -> Refactor Loop

### Red

- Start with a failing test that describes one behavior.
- Make failure messages clear and specific.
- Ensure the test fails for the expected reason.

### Green

- Implement the smallest change that makes the test pass.
- Do not optimize early.
- Avoid adding behavior not required by the current test.

### Refactor

- Improve readability, structure, naming, and duplication.
- Keep behavior unchanged while refactoring.
- Run the full relevant suite after each refactor step.

## 3. What Makes a Good TDD Test

- Single behavior focus: one reason to fail.
- Deterministic: no randomness, timing flakiness, or order dependence.
- Fast: unit tests should run quickly.
- Isolated: avoid real network, file system, or database unless it is an integration test.
- Readable: test intent should be obvious in under 30 seconds.

Use the AAA pattern when useful:

- Arrange: set up data and dependencies.
- Act: execute behavior under test.
- Assert: verify expected outcome.

## 4. Naming and Structure Best Practices

- Use behavior-driven names, for example: `returns empty list when input is null`.
- Group tests by module behavior, not by internal implementation details.
- Prefer explicit expected values over vague assertions.
- Keep test setup local unless shared setup improves clarity.

Recommended test anatomy:

- Test file mirrors source file location.
- One describe block per unit or behavior area.
- Clear setup helper functions for repeated scenarios.

## 5. Test Doubles and Boundaries

- Mock only true external boundaries (APIs, DBs, clocks, UUID generators).
- Avoid mocking value objects and pure functions.
- Prefer fakes over deep mock chains.
- Verify observable behavior, not private calls.

Rule of thumb:

- If refactoring internal implementation breaks tests without changing behavior, the tests are too coupled.

## 6. Unit vs Integration in TDD

- Use unit tests to drive logic quickly.
- Add integration tests for critical flows and boundary contracts.
- Keep a healthy test pyramid:
  - Many unit tests
  - Fewer integration tests
  - Very few end-to-end tests

## 7. Refactoring Discipline

- Refactor only when all tests are green.
- Apply one refactor move at a time.
- Re-run tests frequently, not only at the end.
- Remove duplication in tests too, but do not hide intent.

## 8. Common TDD Anti-Patterns

- Writing multiple failing tests at once.
- Writing broad tests that validate too many concerns.
- Overusing mocks and asserting implementation details.
- Treating TDD as test-after coding.
- Ignoring flaky tests instead of fixing root causes.
- Keeping brittle snapshot tests without focused assertions.

## 9. Workflow with AI (Copilot + TDD)

Use AI as a pair programmer, not as a final authority.

### Recommended AI-assisted loop

1. Ask AI to draft one failing test for a single behavior.
2. Run tests and confirm the new test fails for the right reason.
3. Ask AI for minimal production code to pass only that test.
4. Run tests and confirm green.
5. Ask AI for safe refactor suggestions.
6. Re-run the full relevant suite.

### Prompting patterns that work well

- "Write one failing test for behavior X, no implementation code."
- "Now generate the minimal code to pass only this test."
- "Refactor this function without changing behavior; preserve all tests."
- "Suggest edge-case tests I am missing for this function."

### Guardrails when using AI

- Never accept generated tests without running them.
- Reject tests that assert internals instead of outcomes.
- Review generated code for overengineering.
- Keep commits small per TDD cycle when possible.

## 10. Coverage and Quality Metrics

- Treat coverage as a signal, not a goal.
- Prefer branch coverage over line coverage alone.
- Add mutation testing if available for critical logic.
- Track flaky test rate and mean test runtime.

Healthy indicators:

- Fast local feedback loop.
- Low flaky test count.
- Confidence to refactor without fear.

## 11. Practical Team Conventions

- Enforce tests in pull request checks.
- Require bug fixes to include a regression test first.
- Keep red-green-refactor visible in commit history when practical.
- Document tricky domain behaviors in tests as living examples.

## 12. TDD Checklist (Quick Reference)

Before coding:

- [ ] Do I understand the next smallest behavior?
- [ ] Can I write one failing test for it?

During coding:

- [ ] Did I keep implementation minimal?
- [ ] Did I avoid adding unrelated behavior?

Before finishing:

- [ ] Are all relevant tests green?
- [ ] Did I refactor for clarity and duplication?
- [ ] Did I add edge-case tests where risk is high?

## 13. Definition of Done (TDD)

A change is done when:

- A failing test was written first.
- Minimal code made the test pass.
- Code was refactored safely.
- Relevant suites pass locally and in CI.
- Behavior is documented by readable tests.
