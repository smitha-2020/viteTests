import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { server } from "../server";
import { http, delay, HttpResponse } from "msw";
import { db } from "../db";
import { Category, Product } from "../../entities";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../../providers/CartProvider";
import { AllProviders } from "../AllProviders";

describe("Test the BrowseProducts Page loading stage", () => {
  let categories: Category[] = [];
  let productList: Product[] = [];

  const renderComponent = () => {
    render(
      <Theme>
        <CartProvider>
          <BrowseProducts />
        </CartProvider>
      </Theme>,
      { wrapper: AllProviders }
    );
  };

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.categories.create({ name: "Category " + item });
      categories.push(category);
      [1, 2].forEach(() => {
        productList.push(db.products.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    categories.forEach((category) =>
      db.categories.delete({ where: { id: { equals: category.id } } })
    );

    productList.forEach((product) =>
      db.products.delete({ where: { id: { equals: product.id } } })
    );
  });

  it("should test the loading state of the categories", () => {
    server.use(
      http.get("/categories", () => {
        delay(5000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    screen.debug();
    expect(
      screen.getByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading state after categories are loaded", () => {
    renderComponent();
    screen.debug();

    waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should test the loading state of the products", () => {
    server.use(
      http.get("/products", () => {
        delay(5000);
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    screen.debug();
    expect(
      screen.getByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should hide the loading state after products are loaded", () => {
    renderComponent();
    screen.debug();

    waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  it("should not render error  when categories cannot be fetched", async () => {
    server.use(
      http.get("/categories", () => {
        return HttpResponse.error();
      })
    );
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/ })
    ).catch((err) => console.log(err));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/filter by category/i)
    ).not.toBeInTheDocument();
    //await screen.findByTestId("category-error");
    //expect(await screen.findByTestId("category-error")).toBeInTheDocument();
  });

  it("should return an error when products cannot be fetched", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("expect categories contain the list of categories", async () => {
    renderComponent();
    const categoryDropDown = await screen.findByRole("combobox");
    const user = userEvent.setup();

    expect(categoryDropDown).toBeInTheDocument();
    await user.click(categoryDropDown);

    expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();

    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("expect products display list of products", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryAllByRole("progressbar", { name: "product skeleton bar" })
    );

    expect(
      screen.queryByRole("table", { name: /product list/i })
    ).toBeInTheDocument();

    productList.forEach(async (product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should display products based on category chosen", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", {
        name: /categories/i,
      })
    );

    const user = userEvent.setup();
    await user.click(await screen.findByRole("combobox"));

    await user.click(await screen.findByText(categories[1].name));
    const selectedProducts = db.products.findMany({
      where: { categoryId: { equals: categories[1].id } },
    });

    const productRows = screen.queryAllByRole("row");
    const productRowsWithourHeading = productRows.slice(1);

    expect(productRowsWithourHeading).toHaveLength(selectedProducts.length);
    selectedProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should display products all products when all category is selected", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", {
        name: /categories/i,
      })
    );

    const user = userEvent.setup();
    await user.click(await screen.findByRole("combobox"));

    await user.click(await screen.findByText("All"));

    const allProducts = db.products.getAll();
    const productRows = screen.queryAllByRole("row");
    const productRowsWithourHeading = productRows.slice(1);

    expect(productRowsWithourHeading).toHaveLength(allProducts.length);
  });
});
