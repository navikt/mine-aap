import { render, screen, within } from 'setUpTest';
import { FormErrorSummary } from 'components/FormErrorSummary/FormErrorSummary';
import { Error } from './FormErrorSummary';

const skjemafeil: Error[] = [
  {
    id: 'id1',
    message: 'Feilmelding 1',
    path: 'feltSti1',
  },
  {
    id: 'id2',
    message: 'Feilmelding 2',
    path: 'feltSti2',
  },
  {
    id: 'id3',
    message: 'Feilmelding 3',
    path: 'feltSti3',
  },
];
describe('FormErrorSummary', () => {
  test('er skjult når det ikke finnes noen feil', () => {
    render(<FormErrorSummary id={'id'} errors={[]} />);
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Du må fikse disse feilene før du kan fortsette:',
      hidden: true,
    });
    expect(heading).toBeInTheDocument();
    expect(heading.parentElement).toHaveAttribute('aria-hidden');
    expect(heading.parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  test('vises når det sendes inn en liste med feil', () => {
    render(<FormErrorSummary id={'id'} errors={skjemafeil} />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Du må fikse disse feilene før du kan fortsette:',
      })
    ).toBeVisible();
  });

  test('container har rolle alert', () => {
    render(<FormErrorSummary id={'id'} errors={skjemafeil} />);
    const header = screen.getByRole('heading', {
      level: 2,
      name: 'Du må fikse disse feilene før du kan fortsette:',
    });
    expect(header.parentElement).toHaveAttribute('role', 'alert');
  });

  test('viser en liste over feil', () => {
    render(<FormErrorSummary id={'id'} errors={skjemafeil} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(skjemafeil.length);
  });

  test('hver feil har en lenke med sti til feltet feilen gjelder for', () => {
    render(<FormErrorSummary id={'id'} errors={skjemafeil} />);
    const valideringsfeil = screen.getAllByRole('listitem');
    const feil1 = within(valideringsfeil[0]).getByRole('link', { name: skjemafeil[0].message });
    expect(feil1).toBeVisible();
    expect(feil1).toHaveAttribute('href', `#${skjemafeil[0].path}`);

    const feil2 = within(valideringsfeil[1]).getByRole('link', { name: skjemafeil[1].message });
    expect(feil2).toBeVisible();
    expect(feil2).toHaveAttribute('href', `#${skjemafeil[1].path}`);

    const feil3 = within(valideringsfeil[2]).getByRole('link', { name: skjemafeil[2].message });
    expect(feil3).toBeVisible();
    expect(feil3).toHaveAttribute('href', `#${skjemafeil[2].path}`);
  });
});
