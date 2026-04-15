import { AppHeader } from 'components/AppHeader/AppHeader';
import { render, screen } from 'lib/utils/test/customRender';
import { describe, expect, it } from 'vitest';

describe('AppHeader', () => {
  it('har overskrift på nivå h1', () => {
    render(<AppHeader />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Mine arbeidsavklarings­penger',
      }),
    ).toBeVisible();
  });
});
