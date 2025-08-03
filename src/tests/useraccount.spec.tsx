import UserAccount from "../components/UserAccount";
import { render, screen } from "@testing-library/react";

describe("should check the useraccount compoent", () => {
  it("should check if the edit button is displayed for admin", () => {
    render(<UserAccount user={{ id: 1, name: "Smithea", isAdmin: true }} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/edit/i);
  });
});
