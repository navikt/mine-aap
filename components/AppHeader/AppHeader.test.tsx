import { AppHeader } from 'components/AppHeader/AppHeader';
import { render, screen } from 'setUpTest';

describe('AppHeader', () => {
  test('har overskrift på nivå h1', () => {
    render(<AppHeader />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mine arbeidsavklarings­penger' })).toBeVisible();
  });
});
