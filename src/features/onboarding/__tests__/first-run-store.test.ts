import {
  FIRST_RUN_FLAG_KEY,
  isFirstRun,
  markFirstRunComplete,
} from "@/features/onboarding/first-run-store";

describe("first-run-store", () => {
  let mockStorage: Record<string, string>;

  const createMockStorage = () => ({
    getItem: (key: string) => {
      return mockStorage[key] ?? null;
    },
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
  });

  beforeEach(() => {
    mockStorage = {};
  });

  it("returns true when first-run flag is not set", async () => {
    const storage = createMockStorage();

    const result = await isFirstRun(storage);

    expect(result).toBe(true);
  });

  it("returns false when first-run flag is already set", async () => {
    const storage = createMockStorage();
    mockStorage[FIRST_RUN_FLAG_KEY] = "true";

    const result = await isFirstRun(storage);

    expect(result).toBe(false);
  });

  it("marks first run as complete and persists to storage", async () => {
    const storage = createMockStorage();

    await markFirstRunComplete(storage);

    expect(mockStorage[FIRST_RUN_FLAG_KEY]).toBe("true");
  });

  it("returns false after marking first run complete", async () => {
    const storage = createMockStorage();

    await markFirstRunComplete(storage);
    const result = await isFirstRun(storage);

    expect(result).toBe(false);
  });
});
