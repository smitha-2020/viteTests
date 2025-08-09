import { Skeleton, Table } from "@radix-ui/themes";
import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../entities";
import QuantitySelector from "./QuantitySelector";

const ProductTable = ({
  selectedCategoryId,
}: {
  selectedCategoryId: number | undefined;
}) => {
  const {
    data: products,
    error: errorProducts,
    isLoading: isProductsLoading,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () =>
      await axios.get<Product[]>("/products").then((res) => res.data),
  });

  if (errorProducts)
    return (
      <div data-testid="products-error">Error: {errorProducts.message}</div>
    );

  const skeletons = [1, 2, 3, 4, 5];

  if (errorProducts)
    return <div data-testid="products-error">Error: {errorProducts}</div>;

  const visibleProducts = selectedCategoryId
    ? products!.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <Table.Root role="table" aria-label="product list">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body
        role={isProductsLoading ? "progressbar" : ""}
        aria-label={isProductsLoading ? "products" : ""}
      >
        {isProductsLoading &&
          skeletons.map((skeleton) => (
            <Table.Row
              key={skeleton}
              role="progressbar"
              aria-label="product skeleton bar"
            >
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        {!isProductsLoading &&
          visibleProducts!.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ProductTable;
