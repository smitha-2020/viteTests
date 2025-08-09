import { faker } from "@faker-js/faker";
import { Product } from "../entities";
import { db } from "./db";

describe("Test Suite for checking main", () => {
  let productList: Product[] = [];
  it("should", async () => {
    [1, 2, 3, 4].forEach(() => {
      const product = db.products.create();
      productList.push(product);
    });
  });
});
