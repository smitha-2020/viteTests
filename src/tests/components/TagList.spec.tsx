import { render, screen } from "@testing-library/react";
import TagList from "../../components/TagList";

describe("check the TagList component", () => {
  it("should chck the initially the component renders no list", async () => {
    render(<TagList />);

    const lisItem = await screen.findAllByRole("listitem");
    expect(lisItem.length).toBeGreaterThan(0);
  });
});
