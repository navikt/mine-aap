import { render, screen } from 'setUpTest';
import { DocumentationList } from 'components/DocumentationList/DocumentationList';

const dokumentliste: { tittel: string; href?: string; innsendt?: string }[] = [
  {
    tittel: 'Dokument 1',
    innsendt: '2023-08-10',
  },
  {
    tittel: 'Dokument 2',
    href: '/en/lenke',
    innsendt: '2023-08-10',
  },
  {
    tittel: 'Dokument 3',
  },
];
describe('DocumentationList', () => {
  beforeEach(() => {
    render(<DocumentationList elements={dokumentliste} />);
  });

  test('viser en liste med dokumenter', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(dokumentliste.length);
  });

  test('har lenker for elementer med href', () => {
    expect(screen.getByRole('link', { name: /Dokument 2/ })).toBeVisible();
    const forventetLengde = dokumentliste.filter((dokument) => dokument.href).length;
    expect(screen.getAllByRole('link')).toHaveLength(forventetLengde);
  });

  test('har ikke lenker når elementet ikke har href', () => {
    expect(screen.getByText(/Dokument 1/)).toBeVisible();
    expect(screen.queryByRole('link', { name: /Dokument 1/ })).not.toBeInTheDocument();

    expect(screen.getByText(/Dokument 3/)).toBeVisible();
    expect(screen.queryByRole('link', { name: /Dokument 3/ })).not.toBeInTheDocument();
  });

  test('viser dato for når dokumentet er mottatt når innsendt er satt', () => {
    const forventetLengde = dokumentliste.filter((dokument) => dokument.innsendt).length;
    expect(screen.getAllByText('Mottatt 10. august 2023')).toHaveLength(forventetLengde);
  });
});
