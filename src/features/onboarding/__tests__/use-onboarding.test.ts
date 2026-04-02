import {
  isFirstRun,
  markFirstRunComplete,
} from "@/features/onboarding/first-run-store";
import { getVisibleHints } from "@/features/onboarding/onboarding-hints";

describe("useOnboarding integration", () => {
  let mockStorage: Record<string, string>;

  const createMockStorage = () => ({
    getItem: (key: string) => Promise.resolve(mockStorage[key] ?? null),
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    },
  });

  beforeEach(() => {
    mockStorage = {};
  });

  it("shows hints when first run flag is not set", async () => {
    const storage = createMockStorage();
    const isFirst = await isFirstRun(storage);
    const hints = getVisibleHints(isFirst);

    expect(hints.length).toBe(3);
  });

  it("hides hints after first run is marked complete", async () => {
    const storage = createMockStorage();

    await markFirstRunComplete(storage);

    const isFirst = await isFirstRun(storage);
    const hints = getVisibleHints(isFirst);

    expect(hints.length).toBe(0);
  });

  it("does not show hints on subsequent runs", async () => {
    const storage = createMockStorage();
    mockStorage["onboarding.firstRun"] = "true";

    const isFirst = await isFirstRun(storage);
    const hints = getVisibleHints(isFirst);

    expect(hints.length).toBe(0);
  });
});
