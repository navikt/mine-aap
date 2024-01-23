import { PageHeader } from 'components/PageHeader/index';
import { render, screen } from 'setUpTest';

describe('PageHeader', () => {
  test('har overskrift på nivå 1', () => {
    render(<PageHeader>Overskriften</PageHeader>);
    expect(screen.getByRole('heading', { level: 1, name: 'Overskriften' })).toBeVisible();
  });
});
