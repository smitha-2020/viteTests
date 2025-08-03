import UserAccount from "../components/UserAccount";
import { render, screen } from "@testing-library/react";

describe("should check the useraccount compoent", () => {
  it("should check if the edit button is displayed for admin", () => {
    render(<UserAccount user={{ id: 1, name: "Smithea", isAdmin: true }} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should check if the edit button is displayed for normal user", () => {
    render(<UserAccount user={{ id: 1, name: "Smitha", isAdmin: false }} />);

    const button = screen.queryByText(/edit/i);
    expect(button).toBeNull();
  });

  it("should check if the username is displayed", () => {
    render(<UserAccount user={{ id: 1, name: "Smitha", isAdmin: false }} />);

    const name = screen.getByText(/smitha/i);
    expect(name).toBeInTheDocument();
  });
});
