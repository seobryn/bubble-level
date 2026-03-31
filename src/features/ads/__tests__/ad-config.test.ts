import { getAdUnitIds } from "@/features/ads/ad-config";

describe("getAdUnitIds", () => {
  it("returns Google test banner unit ID in development mode", () => {
    const ids = getAdUnitIds(true);

    expect(ids.banner).toBe("ca-app-pub-3940256099942544/6300978111");
  });

  it("returns production banner unit ID in production mode", () => {
    const ids = getAdUnitIds(false);

    expect(ids.banner).not.toBe("ca-app-pub-3940256099942544/6300978111");
    expect(ids.banner).toMatch(/^ca-app-pub-/);
  });

  it("dev and production IDs are different", () => {
    const devIds = getAdUnitIds(true);
    const prodIds = getAdUnitIds(false);

    expect(devIds.banner).not.toBe(prodIds.banner);
  });
});
