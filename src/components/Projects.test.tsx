import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/site";
import { Projects } from "./Projects";

describe("<Projects />", () => {
  it("renders every project with its title, summary and stack", () => {
    render(<Projects />);
    for (const project of projects) {
      const card = screen.getByTestId(`project-${project.slug}`);
      expect(
        within(card).getByRole("heading", { name: project.title }),
      ).toBeInTheDocument();
      expect(within(card).getByText(project.summary)).toBeInTheDocument();
      for (const tech of project.stack)
        expect(within(card).getByText(tech)).toBeInTheDocument();
    }
  });

  it("only shows a live demo link when the project has one", () => {
    render(<Projects />);
    for (const project of projects) {
      const card = screen.getByTestId(`project-${project.slug}`);
      const demo = within(card).queryByRole("link", { name: /live demo/i });
      if (project.liveUrl)
        expect(demo).toHaveAttribute("href", project.liveUrl);
      else expect(demo).toBeNull();
      expect(
        within(card).getByRole("link", { name: /source/i }),
      ).toHaveAttribute("href", project.sourceUrl);
    }
  });

  it("opens external links safely in a new tab", () => {
    const { container } = render(<Projects />);
    for (const link of container.querySelectorAll('a[target="_blank"]')) {
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });
});
