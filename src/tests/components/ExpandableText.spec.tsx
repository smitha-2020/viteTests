import ExpandableText from "../../components/ExpandableText";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("test suites for Exapandable Text component", () => {
  const text =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio debitis, error nobis incidunt unde in omnis. Repudiandae soluta perspiciatis inventore quia laboriosam natus ipsum consequatur a libero id porro numquam eligendi, neque exercitationem corrupti excepturi eveniet cumque dolor quisquam ipsam similique. Nesciunt esse qui similique alias exercitationem possimus, odit tenetur error ex, accusamus, rerum eos. Ad doloremque ducimus ex voluptatem eum placeat assumenda temporibus autem omnis repudiandae? Non fuga nesciunt eius, sunt quisquam fugiat quo, aut ipsam magni placeat error laborum fugit ducimus sit autem quas ratione adipisci reiciendis! Deleniti ipsa tempore temporibus laboriosam! Ipsam sapiente dolore nostrum voluptatibus placeat amet, repellendus nulla distinctio ipsa laudantium. Voluptatibus, necessitatibus consequuntur cum pariatur eligendi minima fuga quam id! Officiis ipsam natus quidem, soluta dolorum praesentium porro, quisquam autem excepturi necessitatibus saepe sunt nemo similique tempore est sequi enim repudiandae suscipit minima nulla facilis quia molestiae dicta! Neque nam ea quam odio molestias minima eum recusandae beatae omnis quibusdam. Cupiditate eaque distinctio dolores repudiandae asperiores perspiciatis aspernatur modi, sed architecto necessitatibus, repellat reprehenderit quisquam magnam rerum ut doloremque blanditiis voluptatum placeat porro impedit laudantium aliquam odio deserunt accusamus! Odio maxime porro ipsam labore sed asperiores dolorem ratione doloribus a earum! Amet reiciendis sit ad perferendis hic. Architecto, magnam provident? Enim voluptas repudiandae nemo, quidem unde aspernatur saepe accusantium minus debitis sint, maxime repellendus suscipit fugit laboriosam qui ut ipsam ipsum. Rerum excepturi corrupti neque animi! Doloremque quisquam reiciendis tempora inventore unde mollitia, consequatur nostrum quis at fuga nulla quas labore dolore hic vitae iste ullam asperiores aspernatur, deserunt temporibus repellat ad? Dicta, ex? Odit aliquid nihil nisi unde ut iusto non, nam debitis dolore molestias aliquam tenetur temporibus quam perspiciatis provident repellendus? Quia sint inventore dolores ipsum eveniet expedita iure, voluptatem nemo asperiores accusamus architecto cumque accusantium quis aut ullam totam! Quibusdam, nulla?";
  it("should show the default behaviour when the short text", () => {
    const text = "smitha";
    render(<ExpandableText text={text} />);

    const articleComponent = screen.getByRole("article");
    expect(articleComponent).toBeInTheDocument();
    expect(articleComponent).toHaveTextContent(`${text}`);
  });

  it("should display 255 charecters if text length is greater than 255", () => {
    render(<ExpandableText text={text} />);

    const articleComponent = screen.getByRole("article");
    const buttonText = screen.getByText(/more/i);
    expect(buttonText).toBeInTheDocument();
    expect(articleComponent).toBeInTheDocument();
    expect(articleComponent).toHaveTextContent(`${text.substring(0, 255)}...`);
  });

  it("should display the entire text when show more is clicked", async () => {
    render(<ExpandableText text={text} />);

    const articleComponent = screen.getByRole("article");
    expect(articleComponent).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(/less/i)).toBeInTheDocument();
    expect(articleComponent).toHaveTextContent(`${text}`);
  });

  it("should collapse text when show less is clicked", async () => {
    render(<ExpandableText text={text} />);

    const articleComponent = screen.getByRole("article");
    expect(articleComponent).toBeInTheDocument();
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    expect(showMoreButton).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(showMoreButton);
    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);
    expect(articleComponent).toHaveTextContent(`${text.substring(0, 255)}...`);
  });
});
