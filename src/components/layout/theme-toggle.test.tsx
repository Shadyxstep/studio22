import { beforeEach, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { THEME_STORAGE_KEY, ThemeToggle } from "./ThemeToggle";

beforeEach(() => {
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

test("toggles light mode on the document and persists the choice", () => {
  render(<ThemeToggle />);
  const button = screen.getByRole("button", { name: /toggle theme/i });

  expect(button.getAttribute("aria-pressed")).toBe("false");

  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  expect(button.getAttribute("aria-pressed")).toBe("true");

  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBeUndefined();
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
});

test("respects a pre-set light theme on mount", () => {
  document.documentElement.dataset.theme = "light";
  render(<ThemeToggle />);
  expect(
    screen.getByRole("button", { name: /toggle theme/i }).getAttribute(
      "aria-pressed",
    ),
  ).toBe("true");
});
