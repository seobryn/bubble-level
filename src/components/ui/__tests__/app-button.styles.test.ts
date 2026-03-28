import { resolveAppButtonStyle } from "@/components/ui/app-button.styles";
import { ButtonVariant } from "@/design-system/tokens";

describe("resolveAppButtonStyle", () => {
  const theme = {
    backgroundElement: "#111111",
    backgroundSelected: "#222222",
  };

  it("uses selected background for solid variant", () => {
    expect(resolveAppButtonStyle(ButtonVariant.solid, theme, false)).toEqual({
      backgroundColor: "#222222",
      opacity: 1,
    });
  });

  it("uses element background for ghost variant", () => {
    expect(resolveAppButtonStyle(ButtonVariant.ghost, theme, false)).toEqual({
      backgroundColor: "#111111",
      opacity: 1,
    });
  });

  it("applies disabled opacity", () => {
    expect(resolveAppButtonStyle(ButtonVariant.solid, theme, true)).toEqual({
      backgroundColor: "#222222",
      opacity: 0.5,
    });
  });
});
