import { render, screen } from "@testing-library/react";
import ToastDemo from "../../components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("should check the toast component", () => {
  it("should check if the button exists and displays toast on click", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(button).toBeInTheDocument();
    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });
});
