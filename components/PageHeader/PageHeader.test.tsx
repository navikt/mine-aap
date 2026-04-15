import { PageHeader } from 'components/PageHeader/index';
import { render, screen } from 'lib/utils/test/customRender';
import { describe, expect, it } from 'vitest';

describe('PageHeader', () => {
  it('har overskrift på nivå 1', () => {
    render(<PageHeader>Overskriften</PageHeader>);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Overskriften' }),
    ).toBeVisible();
  });
});
