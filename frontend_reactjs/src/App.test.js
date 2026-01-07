import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders site brand in navbar", () => {
  render(<App />);
  const brand = screen.getByText(/mobile service hub/i);
  expect(brand).toBeInTheDocument();
});
