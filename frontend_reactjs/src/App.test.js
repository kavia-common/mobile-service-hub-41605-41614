import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders site brand in navbar", () => {
  render(<App />);
  // Brand text can appear in multiple places (Navbar + Footer). Ensure it's present at least once.
  const matches = screen.getAllByText(/mobile service hub/i);
  expect(matches.length).toBeGreaterThan(0);
});
