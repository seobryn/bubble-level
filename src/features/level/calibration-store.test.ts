import {
  CALIBRATION_STORAGE_KEY,
  loadCalibration,
  saveCalibration,
  type StorageLike,
} from "@/features/level/calibration-store";

describe("calibration-store", () => {
  function createMemoryStorage(
    initial: Record<string, string> = {},
  ): StorageLike {
    const state = new Map<string, string>(Object.entries(initial));

    return {
      getItem(key: string) {
        return Promise.resolve(state.get(key) ?? null);
      },
      setItem(key: string, value: string) {
        state.set(key, value);
        return Promise.resolve();
      },
      removeItem(key: string) {
        state.delete(key);
        return Promise.resolve();
      },
    };
  }

  it("saves calibration using the expected storage key", async () => {
    const storage = createMemoryStorage();

    await saveCalibration(storage, { pitch: 1.5, roll: -0.25 });

    await expect(storage.getItem(CALIBRATION_STORAGE_KEY)).resolves.toBe(
      '{"pitch":1.5,"roll":-0.25}',
    );
  });

  it("loads calibration from storage", async () => {
    const storage = createMemoryStorage({
      [CALIBRATION_STORAGE_KEY]: '{"pitch":2,"roll":-1}',
    });

    await expect(loadCalibration(storage)).resolves.toEqual({
      pitch: 2,
      roll: -1,
    });
  });

  it("returns null when stored payload is invalid", async () => {
    const storage = createMemoryStorage({
      [CALIBRATION_STORAGE_KEY]: '{"pitch":"oops","roll":1}',
    });

    await expect(loadCalibration(storage)).resolves.toBeNull();
  });

  it("returns null when nothing is stored", async () => {
    const storage = createMemoryStorage();

    await expect(loadCalibration(storage)).resolves.toBeNull();
  });
});
