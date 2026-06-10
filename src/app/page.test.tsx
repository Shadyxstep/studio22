import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

test("placeholder home renders hero copy from the live-site inventory", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: /the future of wellness/i }),
  ).toBeDefined();
  expect(
    screen.getByText(/movement\. strength\. recovery\. community/i),
  ).toBeDefined();
});
