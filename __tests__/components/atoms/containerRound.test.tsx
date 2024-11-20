import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ContainerRound from "@/components/atoms/containerRound";

describe("ContainerRound Component", () => {
  it("renders the ContainerRound component", () => {
    render(<ContainerRound>Test Content</ContainerRound>);

    // Check if the div with class "roundBox" is in the document
    const container = screen.getByRole("region");
    expect(container).toBeInTheDocument();

    // Check if the children ("Test Content") are rendered
    expect(container).toHaveTextContent("Test Content");
  });
});
