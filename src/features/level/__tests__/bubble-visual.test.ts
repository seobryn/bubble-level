import { computeBubbleOffset } from "@/features/level/bubble-visual";

describe("bubble-visual", () => {
  it("returns centered bubble for level angles", () => {
    const offset = computeBubbleOffset({
      angles: { pitch: 0, roll: 0 },
      travelRadius: 80,
    });

    expect(offset).toEqual({ x: 0, y: 0 });
  });

  it("maps pitch and roll proportionally within the travel radius", () => {
    const offset = computeBubbleOffset({
      angles: { pitch: 5, roll: -2.5 },
      travelRadius: 80,
      maxTiltDeg: 10,
    });

    expect(offset).toEqual({ x: 20, y: -40 });
  });

  it("clamps bubble movement when tilt exceeds the configured range", () => {
    const offset = computeBubbleOffset({
      angles: { pitch: -30, roll: 15 },
      travelRadius: 80,
      maxTiltDeg: 10,
    });

    expect(offset).toEqual({ x: -80, y: 80 });
  });
});
