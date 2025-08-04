import { render, screen } from "@testing-library/react";
import UserAccount from "../../components/UserAccount";
import { User } from "../../entities";

describe("should check the useraccount compoent", () => {
  it("should check if the edit button is displayed for admin", () => {
    const user: User = { id: 1, name: "Smithea", isAdmin: true };
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not display edit button for the normal user", () => {
    const user: User = { id: 1, name: "Smitha" };
    render(<UserAccount user={user} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should check if the username is displayed if it is a normal user or an admin", () => {
    const user: User = { id: 1, name: "Smitha" };
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
  it("should check if the username is displayed if it is a admin", () => {
    const user = { id: 1, name: "Smitha", isAdmin: true };
    render(<UserAccount user={user} />);

    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
});
