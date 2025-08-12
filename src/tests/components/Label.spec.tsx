import { render, screen } from "@testing-library/react";
import Label from "../../components/Label";
import { LanguageProvider } from "../../providers/language/LanguageProvider";
import { Language } from "../../providers/language/type";

describe("To check label component", () => {
  const renderLanguageComponent = (
    labelId: string,
    languageChosen: Language
  ) => {
    render(
      <LanguageProvider language={languageChosen}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe("Group based on the Language ES", () => {
    it.each([
      { labelId: "welcome", translatedText: "Bienvenidos" },
      { labelId: "new_product", translatedText: "Nuevo Producto" },
      { labelId: "edit_product", translatedText: "Editar Producto" },
    ])(
      "should check the $labelId renders $translatedText in the body",
      ({ labelId, translatedText }) => {
        renderLanguageComponent(labelId, "es");

        expect(screen.getByText(translatedText)).toBeInTheDocument();
      }
    );
  });

  describe("Group based on the Language EN", () => {
    it.each([
      { labelId: "welcome", translatedText: "Welcome" },
      { labelId: "new_product", translatedText: "New Product" },
      { labelId: "edit_product", translatedText: "Edit Product" },
    ])(
      "should check the $labelId renders $translatedText in the body",
      ({ labelId, translatedText }) => {
        renderLanguageComponent(labelId, "en");

        expect(screen.getByText(translatedText)).toBeInTheDocument();
      }
    );
  });

  it("should check the wrong $labelId throws error", async () => {
    expect(() => renderLanguageComponent("!", "es")).toThrowError();
  });
});
