import TermsAndConditions from "../../components/TermsAndConditions";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("check the terms and condition component", () => {
  beforeEach(() => render(<TermsAndConditions />));
  it("should check the initial state checkbox uncheked and button grayed out", () => {
    screen.debug();

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    const checkbox = screen.getByLabelText(/accept/i, { selector: "input" });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should check the iif the button is enabled when the checbox is checked", async () => {
    screen.debug();

    const checkbox = screen.getByLabelText(/accept/i, { selector: "input" });
    const user = userEvent.setup();

    await user.click(checkbox);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeEnabled();

    expect(screen.getByRole("button")).toBeEnabled();
  });
});
