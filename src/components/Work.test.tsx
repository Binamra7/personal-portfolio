import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { archiveProjects, featuredProjects } from "@/content/site";
import { Work } from "./Work";

describe("<Work />", () => {
  it("renders featured projects with summary and the right links", () => {
    render(<Work />);
    for (const project of featuredProjects) {
      const card = screen.getByTestId(`project-${project.slug}`);
      expect(within(card).getByRole("heading", { name: project.title })).toBeInTheDocument();
      expect(within(card).getByText(project.summary)).toBeInTheDocument();

      const demo = within(card).queryByRole("link", { name: /live demo/i });
      if (project.liveUrl) expect(demo).toHaveAttribute("href", project.liveUrl);
      else expect(demo).toBeNull();

      if (project.sourceUrl) {
        expect(within(card).getByRole("link", { name: /source/i })).toHaveAttribute(
          "href",
          project.sourceUrl,
        );
      } else {
        expect(within(card).getByText(/private code/i)).toBeInTheDocument();
      }
    }
  });

  it("links each archive row to its demo and source", () => {
    render(<Work />);
    for (const project of archiveProjects) {
      const row = screen.getByTestId(`project-${project.slug}`);
      expect(
        within(row).getByRole("link", {
          name: new RegExp(`^${project.title}`),
        }),
      ).toHaveAttribute("href", project.liveUrl ?? project.sourceUrl);
    }
  });
});
