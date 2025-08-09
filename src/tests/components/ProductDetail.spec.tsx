import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../components/ProductDetail";
import { server } from "../server";
import { http, HttpResponse, delay } from "msw";
import { db } from "../db";
import { Product } from "../../entities";
import { QueryClient, QueryClientProvider } from "react-query";
import { AllProviders } from "../AllProviders";

describe("should test the product Detail component", () => {
  let product: Partial<Product>;
  beforeAll(() => (product = db.products.create()));

  afterAll(() => {
    db.products.deleteMany({ where: { id: { equals: product.id } } });
  });

  it("should check if the specific product is displayed", async () => {
    render(<ProductDetail productId={product.id!} />, {
      wrapper: AllProviders,
    });

    expect(
      await screen.findByText(new RegExp(product.name!))
    ).toBeInTheDocument();
  });

  it("should check if the given product is not found", async () => {
    server.use(
      http.get("/products/1", () => {
        return HttpResponse.json(null);
      })
    );
    render(<ProductDetail productId={1} />, {
      wrapper: AllProviders,
    });

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should check if product id is 0", async () => {
    render(<ProductDetail productId={0} />, {
      wrapper: AllProviders,
    });

    expect(await screen.findByText(/404/i)).toBeInTheDocument();
  });

  it("should return error in case the fetch fails", async () => {
    server.use(
      http.get("/products/:id", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductDetail productId={2} />, {
      wrapper: AllProviders,
    });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should return loading when data is being fetched", async () => {
    server.use(
      http.get("/products/:id", async () => {
        await delay(2000);
        return HttpResponse.json([]);
      })
    );
    render(<ProductDetail productId={2} />, {
      wrapper: AllProviders,
    });
    screen.debug();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading component when the data is fetched ", async () => {
    server.use(
      http.get("/products/:id", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductDetail productId={2} />, {
      wrapper: AllProviders,
    });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
