import { factory, manyOf, oneOf, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  categories: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf("products"),
  },
  products: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf("categories"),
  },
});
