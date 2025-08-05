import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TeamCard from "../TeamCard";
import "@testing-library/jest-dom";

describe("TeamCard Component", () => {
  const mockTeam = {
    teamName: "Chennai Super Kings",
    totalMatches: 238,
    totalWins: 138,
  };

  test("renders team name and stats correctly", () => {
    const { getByText } = render(
      <BrowserRouter>
        <TeamCard team={mockTeam} />
      </BrowserRouter>
    );

    expect(getByText(/Chennai Super Kings/i)).toBeInTheDocument();
    expect(getByText(/Matches: 238/)).toBeInTheDocument();
    expect(getByText(/Wins: 138/)).toBeInTheDocument();
  });

  test("navigates to correct URL", () => {
    const { getByRole } = render(
      <BrowserRouter>
        <TeamCard team={mockTeam} />
      </BrowserRouter>
    );

    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/team/Chennai Super Kings");
  });
});
