import { render, screen } from "@testing-library/react";
import Greet from "../components/Greet";

describe("Test Suite for checking greet component", () => {
  it("should check if the heading tag exists", () => {
    render(<Greet name="Smitha" />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello/i);
  });

  it("should check if the login Button exists", () => {
    render(<Greet />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
