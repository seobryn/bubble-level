import { isPremium, setPremiumStatus } from "../premium-store";

describe("premium-store", () => {
  let mockStorage: any;

  beforeEach(() => {
    const store = new Map<string, string>();
    mockStorage = {
      getItem: jest.fn(async (key: string) => store.get(key) || null),
      setItem: jest.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
    };
  });

  it("returns false if premium status is not set", async () => {
    const result = await isPremium(mockStorage);
    expect(result).toBe(false);
  });

  it("returns true if premium status is set to true", async () => {
    await mockStorage.setItem("premium.isPremium", "true");
    const result = await isPremium(mockStorage);
    expect(result).toBe(true);
  });

  it("updates premium status to true", async () => {
    await setPremiumStatus(mockStorage, true);
    expect(mockStorage.setItem).toHaveBeenCalledWith("premium.isPremium", "true");
    const result = await isPremium(mockStorage);
    expect(result).toBe(true);
  });
});
