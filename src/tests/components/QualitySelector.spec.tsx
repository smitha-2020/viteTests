import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../components/QuantitySelector";
import { Product } from "../../entities";
import { CartProvider } from "../../providers/CartProvider";
import { db } from "../db";

describe("check the Quality Selector component", () => {
  let product: Product;
  beforeAll(() => {
    product = db.products.create({ name: "Product 1" });
  });

  afterAll(() => {
    db.products.delete({ where: { id: { equals: product.id } } });
  });
  //helper function
  const renderComponent = () => {
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getInputs: () => ({
        addButton: screen.queryByRole("button", { name: /add/i }),
        incrementButton: screen.findByRole("button", { name: "+" }),
        decrementButton: screen.findByRole("button", { name: "-" }),
        statusButton: screen.findByRole("status"),
      }),
      //incrementButton: () => screen.queryByRole("button", { name: "+" }),
      //decrementButton: () => screen.queryByRole("button", { name: "-" }),
      //statusButton: () => screen.queryByRole("status"),
      addButton: screen.queryByRole("button", { name: /add/i }),
      user: userEvent.setup(),
    };
  };

  it("should check the intial rendering of the component", async () => {
    const { addButton } = renderComponent();

    expect(addButton).toBeInTheDocument();
  });

  it("should check whether component has increment and decrement button", async () => {
    const { getInputs, user } = renderComponent();

    const { addButton, incrementButton, decrementButton, statusButton } =
      getInputs();

    await user.click(addButton!);
    expect(await incrementButton).toBeInTheDocument();
    expect(await decrementButton).toBeInTheDocument();
    expect(await statusButton).toBeInTheDocument();
  });

  it("should increment twice and chcek the quantity", async () => {
    const { getInputs, user } = renderComponent();

    const { addButton, incrementButton, statusButton } = getInputs();

    await user.click(addButton!);
    expect(await incrementButton).toBeInTheDocument();
    await user.click(await incrementButton);

    expect(await statusButton).toHaveTextContent("2");
  });

  it("should decrement to remove the product from the cart", async () => {
    const { getInputs, user } = renderComponent();

    const { addButton, incrementButton, decrementButton, statusButton } =
      getInputs();

    await user.click(addButton!);
    expect(await incrementButton).toBeInTheDocument();
    expect(await decrementButton).toBeInTheDocument();

    await user.click(await decrementButton);

    expect(
      await screen.findByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });
});
