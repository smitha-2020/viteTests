import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import { QueryClient, QueryClientProvider } from "react-query";
import ProductList from "../../components/ProductList";
import { AllProviders } from "../AllProviders";
import { db } from "../db";
import { server } from "../server";

describe("check the ProductList component", () => {
  const productCreatedIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.products.create();
      productCreatedIds.push(product.id);
    });
  });

  afterAll(() => {
    db.products.deleteMany({ where: { id: { in: productCreatedIds } } });
  });

  it("should check the fetching of the products", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    const items = await screen.findAllByRole("listitem");

    expect(items.length).toBeGreaterThan(0);
  });
  it("should check the component when no products are displayed", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it("should return an error when fetching fails", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/error: /i)).toBeInTheDocument();
  });

  it("should return loading when the data is not yet fetched", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(2000);
        HttpResponse.error();
      })
    );

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading when the data returned", async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
