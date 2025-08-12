import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import ProductForm from "../../components/ProductForm";
import { Category, Product } from "../../entities";
import { AllProviders } from "../AllProviders";
import { db } from "../db";

describe("test to check the product form", () => {
  const categories: Category[] = [];
  let product: Product;
  type ProductFormData = { [K in keyof Product]: any } & {
    errorMessage: RegExp;
  };

  beforeAll(() => {
    [1, 2, 3, 4].forEach((index) => {
      const category = db.categories.create({ name: "category" + index });
      categories.push(category);
    });
  });

  afterAll(() => {
    categories.forEach((category) =>
      db.categories.delete({ where: { id: { equals: category.id } } })
    );
  });

  const renderProductForm = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <Toaster />
        <Theme>
          <ProductForm product={product} onSubmit={onSubmit} />
        </Theme>
      </>,

      { wrapper: AllProviders }
    );

    return {
      getInputs: () => {
        const inputName = screen.getByPlaceholderText(/name/i);
        const inputPrice = screen.getByPlaceholderText(/price/i);
        const comboBoxSelect = screen.getByRole("combobox");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        const fillForm = async (product: ProductFormData | Product) => {
          const user = userEvent.setup();

          await user.type(inputName, product.name);

          await user.type(inputPrice, product.price.toString());
          await user.tab();

          await user.click(comboBoxSelect);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);

          expect(inputName).toBeInTheDocument();
          expect(inputPrice).toBeInTheDocument();

          await user.click(submitButton);

          const alertMsg = screen.queryByRole("alert");

          return alertMsg;
        };

        return {
          inputName,
          inputPrice,
          comboBoxSelect,
          submitButton,
          fillForm,
        };
      },
      loadingScreen: () => screen.getByText(/loading/i),
      onSubmit,
    };
  };

  it("should check if the fields exist", async () => {
    const { loadingScreen, getInputs } = renderProductForm();

    await waitForElementToBeRemoved(loadingScreen());

    const data = getInputs();

    const categorySelect = data.comboBoxSelect;

    expect(data.inputName).toBeInTheDocument();
    expect(data.inputPrice).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(categorySelect);

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });

    expect(screen.getAllByRole("option")).toHaveLength(categories.length);
  });

  it("should check initial data in the product form", async () => {
    product = {
      id: 1,
      name: "Product 1",
      categoryId: categories[0].id,
      price: 400,
    };
    const { loadingScreen, getInputs } = renderProductForm(product);

    await waitForElementToBeRemoved(loadingScreen());

    const data = getInputs();

    expect(data.inputName).toBeInTheDocument();
    expect(data.inputPrice).toBeInTheDocument();
  });

  it('"check if the name field is focused on rendering"', async () => {
    const { loadingScreen, getInputs } = renderProductForm(product);

    await waitForElementToBeRemoved(loadingScreen());

    const data = getInputs();

    expect(data.inputName).toHaveFocus();
  });

  it.each([
    {
      scenario: "too lengthy name",
      field: /name/i,
      name: "o".repeat(256),
      errorMessage: /255/i,
    },
    {
      scenario: "name required",
      field: /name/i,
      name: "9",
      errorMessage: /required/,
    },
  ])(
    "Validate the Fields $field $scenario for $errorMessage price and category",
    async ({ field, name, errorMessage }) => {
      const { loadingScreen, getInputs } = renderProductForm();

      await waitForElementToBeRemoved(loadingScreen());

      const data = getInputs();
      const formOutput = await data.fillForm({
        ...product,
        name,
        errorMessage,
      });

      expect(formOutput).toBeInTheDocument();
      expect(formOutput).toHaveTextContent(errorMessage);
    }
  );
  it.each([
    {
      scenario: "too small value",
      field: /price/i,
      price: 0,
      errorMessage: /greater than or equal to 1/i,
    },
    {
      scenario: "too large value",
      field: /price/i,
      price: 3000,
      errorMessage: /1000/i,
    },
    {
      scenario: "negetive value",
      field: /price/i,
      price: -1,
      errorMessage: /greater than or equal to 1/i,
    },
    {
      scenario: "required field",
      field: /price/i,
      price: "smitha",
      errorMessage: /required/i,
    },
    {
      scenario: "non numeric value",
      field: /price/i,
      price: "a",
      errorMessage: /required/i,
    },
  ])(
    "Validate the Fields $field $scenario for $errorMessage price and category",
    async ({ field, price, errorMessage }) => {
      const { loadingScreen, getInputs } = renderProductForm();

      await waitForElementToBeRemoved(loadingScreen());

      const data = getInputs();

      const formOutput = await data.fillForm({
        ...product,
        price,
        errorMessage,
      });

      expect(formOutput).toBeInTheDocument();
      expect(formOutput).toHaveTextContent(errorMessage);
    }
  );

  it("should check new product form submission ", async () => {
    const { loadingScreen, getInputs, onSubmit } = renderProductForm();

    await waitForElementToBeRemoved(loadingScreen());

    const data = getInputs();

    await data.fillForm(product);

    const { id, ...restProduct } = product;

    expect(onSubmit).toHaveBeenCalledWith({
      ...restProduct,
      categoryId: categories[0].id,
    });
    expect(
      await screen.findByRole("button", { name: /submit/i })
    ).not.toBeDisabled();
  });

  it("should check  for failure on form submission ", async () => {
    const { loadingScreen, getInputs, onSubmit } = renderProductForm();
    onSubmit.mockRejectedValue({});

    await waitForElementToBeRemoved(loadingScreen());

    const data = getInputs();

    await data.fillForm(product);
    screen.debug();
  });
});
