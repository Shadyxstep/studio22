import { describe, expect, test } from "vitest";
import { heroFade, resolveVariants, reveal, revealStagger, v2Motion, v2MotionVars } from "./motion";

describe("SPEC §8.4 motion presets", () => {
  test("reveal is a 0.6s fade + 24px rise", () => {
    expect(reveal.hidden).toMatchObject({ opacity: 0, y: 24 });
    expect(reveal.visible).toMatchObject({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    });
  });

  test("revealStagger staggers children by 80ms", () => {
    expect(revealStagger.visible).toMatchObject({
      transition: { staggerChildren: 0.08 },
    });
  });

  test("heroFade is a 0.8s opacity + scale settle", () => {
    expect(heroFade.hidden).toMatchObject({ opacity: 0, scale: 1.02 });
    expect(heroFade.visible).toMatchObject({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    });
  });

  test("reduced motion renders every preset fully visible and static", () => {
    for (const preset of [reveal, revealStagger, heroFade]) {
      const v = resolveVariants(preset, true);
      expect(v.hidden).toEqual({ opacity: 1, y: 0, scale: 1 });
      expect(v.visible).toEqual({ opacity: 1, y: 0, scale: 1 });
    }
  });

  test("without reduced motion the preset passes through unchanged", () => {
    expect(resolveVariants(reveal, false)).toBe(reveal);
  });
});

describe("V2 ambient presets", () => {
  test("exposed as CSS custom properties with units", () => {
    const vars = v2MotionVars();
    expect(vars["--v2-reveal"]).toBe("750ms");
    expect(vars["--v2-stagger"]).toBe("80ms");
    expect(vars["--v2-edge-lap"]).toBe(`${v2Motion.edgeLapS}s`);
    for (const v of Object.values(vars)) expect(v).toMatch(/^\d+(ms|s)$/);
  });

  test("ambient loops are slow (none faster than 9s)", () => {
    const loops = [v2Motion.edgeLapS, ...v2Motion.driftS, v2Motion.glowS, v2Motion.breatheS, v2Motion.timelineS];
    for (const s of loops) expect(s).toBeGreaterThanOrEqual(9);
  });
});
