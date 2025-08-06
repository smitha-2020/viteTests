import { render, screen } from "@testing-library/react";
import SearchBox from "../../components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("test suite for search box component", () => {
  const renderComponent = () => {
    const mockFn = vi.fn();
    render(<SearchBox onChange={mockFn} />);
    const user = userEvent.setup();

    return {
      textBox: screen.getByPlaceholderText(/search/i),
      mockFn,
      user,
    };
  };
  it("should check if the search textBox exists", async () => {
    const { textBox } = renderComponent();

    expect(textBox).toBeInTheDocument();
  });

  it("should check if the user seachbox is triggered", async () => {
    const { textBox, mockFn, user } = renderComponent();
    const searchTerm = "World!";

    await user.type(textBox, searchTerm + "{enter}");

    expect(mockFn).toBeCalled();
    expect(mockFn).toHaveBeenCalledWith(searchTerm);
  });

  it("should check if the empty textBox does not trigger the mock function", async () => {
    const { textBox, mockFn, user } = renderComponent();

    await user.type(textBox, "{enter}");

    expect(mockFn).not.toHaveBeenCalled();
  });
});
