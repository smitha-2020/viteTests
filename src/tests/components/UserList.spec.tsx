import UserList from "../../components/UserList";
import { render, screen } from "@testing-library/react";
import { User } from "../../entities";

describe("check the userlist component", () => {
  it("should return a no users available message when user array is 0", () => {
    const users: User[] = [];
    render(<UserList users={users} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  it("should match if each user link exists", () => {
    const users: User[] = [
      { id: 1, name: "smitha" },
      { id: 2, name: "anup" },
      { id: 3, name: "geetha" },
      { id: 4, name: "anvitha" },
    ];
    render(<UserList users={users} />);
    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
