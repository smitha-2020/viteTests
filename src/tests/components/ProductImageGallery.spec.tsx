import ProductImageGallery from "../../components/ProductImageGallery";
import { render, screen } from "@testing-library/react";

describe("testing product image gallery component", () => {
  it("should display an empty document when the images are empty array", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should display an list of images when passed a images array", () => {
    const images = ["smitha.jpg", "anup.jpg"];
    render(<ProductImageGallery imageUrls={images} />);

    const imagesByRole = screen.getAllByRole("img");
    expect(imagesByRole).toHaveLength(2);

    images.forEach((img, index) => {
      expect(imagesByRole[index]).toHaveAttribute("src", img);
    });
  });
});
