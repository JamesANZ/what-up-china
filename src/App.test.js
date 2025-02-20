import { render, screen } from "@testing-library/react";
import Main from "./components/body";

test("renders learn react link", () => {
  render(<Main />);
  const linkElement = screen.getByText("what-up-china");
  expect(linkElement).toBeInTheDocument();
});
