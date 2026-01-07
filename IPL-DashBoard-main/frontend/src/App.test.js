import { render, screen } from '@testing-library/react';

// react-scripts/Jest in this repo doesn't transform ESM-only deps like axios.
// Mock route components that import axios to prevent Jest from loading axios.
jest.mock('./components/TeamList', () => () => <div>Teams</div>);
jest.mock('./components/PlayerList', () => () => <div>Players</div>);
jest.mock('./components/HeadToHeadPage', () => () => <div>HeadToHead</div>);
jest.mock('./components/SearchResultsPage', () => () => <div>Search</div>);
jest.mock('./components/TeamPage', () => ({ TeamPage: () => <div>TeamPage</div> }));
jest.mock('./components/PlayerPage', () => () => <div>PlayerPage</div>);
jest.mock('./components/MatchPage', () => () => <div>MatchPage</div>);

import App from './App';

test('renders app shell', () => {
  render(<App />);
  // UI renders the product name in multiple places (nav + page + footer).
  expect(screen.getAllByText(/IPL Dashboard/i).length).toBeGreaterThan(0);
});
