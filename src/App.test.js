import { render, screen } from "@testing-library/react";
import Main from "./components/body";

test("renders hero headline", () => {
  render(<Main />);
  const heading = screen.getByText(/What's Trending Across China/i);
  expect(heading).toBeInTheDocument();
});
