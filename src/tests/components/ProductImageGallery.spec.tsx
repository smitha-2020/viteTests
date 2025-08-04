import ProductImageGallery from "../../components/ProductImageGallery";
import { render, screen } from "@testing-library/react";

describe("testing product image gallery component", () => {
  it("should display a list of product images", () => {
    const images: string[] = ["smitha.jpg", "anup.jpg"];
    render(<ProductImageGallery imageUrls={images} />);
    const listTag = screen.getByRole("list");
    expect(listTag).toBeInTheDocument();
  });
});
