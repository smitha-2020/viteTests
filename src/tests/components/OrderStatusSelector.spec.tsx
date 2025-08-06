import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("should check orderstatusselector component", () => {
  const renderComponent = () => {
    const mockFn = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={mockFn} />
      </Theme>
    );
    return {
      button: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
      user: userEvent.setup(),
      mockFn,
    };
  };
  it("should check dropdown", async () => {
    const { button, getOptions, user } = renderComponent();

    expect(button).toHaveTextContent(/new/i);

    await user.click(button);

    const options = await getOptions();

    const optionArr = options.map((option) => option.textContent);
    expect(optionArr).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should check $label with $value is selected",
    async ({ label, value }) => {
      const { button, user, mockFn } = renderComponent();

      await user.click(button);
      const selectedOption = await screen.findByRole("option", {
        name: label,
      });
      await user.click(selectedOption);

      expect(mockFn).toHaveBeenCalledWith(value);
    }
  );

  it("should check if the new option is selected", async () => {
    const { button, user, mockFn } = renderComponent();

    user.click(button);
    const selectedProcessedOption = await screen.findByRole("option", {
      name: /processed/i,
    });
    await user.click(selectedProcessedOption);

    user.click(button);
    const newOption = await screen.findByRole("option", {
      name: /new/i,
    });
    await user.click(newOption);

    expect(mockFn).toHaveBeenCalledWith("new");
  });
});
