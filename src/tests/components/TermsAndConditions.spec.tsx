import TermsAndConditions from "../../components/TermsAndConditions";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("check the terms and condition component", () => {
  beforeEach(() => render(<TermsAndConditions />));
  const componentRender = () => {
    return {
      checkboxx: screen.getByLabelText(/accept/i, { selector: "input" }),
      heading: screen.getByRole("heading", { level: 1 }),
      button: screen.getByRole("button"),
    };
  };

  it("should check the initial state checkbox uncheked and button grayed out", () => {
    componentRender();
    screen.debug();

    const { checkboxx, heading, button } = componentRender();

    expect(heading).toBeInTheDocument();
    expect(checkboxx).toBeInTheDocument();
    expect(checkboxx).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  it("should check the iif the button is enabled when the checbox is checked", async () => {
    componentRender();
    screen.debug();
    const { checkboxx, button } = componentRender();

    const user = userEvent.setup();
    await user.click(checkboxx);

    expect(checkboxx).toBeInTheDocument();
    expect(checkboxx).toBeEnabled();
    expect(button).toBeEnabled();
  });
});
