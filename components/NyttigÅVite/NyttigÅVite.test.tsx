import { NyttigÅVite } from 'components/NyttigÅVite/NyttigÅVite';
import { render, screen } from 'setUpTest';

describe('NyttigÅVite', () => {
  beforeEach(() => {
    render(<NyttigÅVite />);
  });

  test('har overskrift på nivå 2', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'Nyttig å vite' })).toBeVisible();
  });

  test('har lenke til forventede saksbehandlingstider', () => {
    const lenke = screen.getByRole('link', { name: 'Forventede saksbehandlingstider (åpnes i ny fane)' });
    expect(lenke).toBeVisible();
    expect(lenke).toHaveAttribute('target', '_blank');
  });

  test('har lenke til alle innsendte søknader', () => {
    const lenke = screen.getByRole('link', { name: 'Alle dine innsendte søknader' });
    expect(lenke).toBeVisible();
    expect(lenke).not.toHaveAttribute('target');
  });

  test('har overskrift på nivå 3', () => {
    expect(screen.getByRole('heading', { level: 3, name: 'Vi har mottatt søknaden din, hva skjer nå?' })).toBeVisible();
  });

  test('har overskrifter på niva 4', () => {
    expect(screen.getByRole('heading', { level: 4, name: 'Vi sjekker om vi har nok helseopplysninger' })).toBeVisible();
    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'Vi vurderer mulighetene og begrensningene dine i møte med arbeidslivet',
      })
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 4, name: 'Hva kan du gjøre?' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 4, name: 'Vi sjekker om du har rett til AAP' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 4, name: 'Svar på AAP-søknaden' })).toBeVisible();
  });

  test('har lenke til cv-registrering på arbeidsplassen.no', () => {
    const lenke = screen.getByRole('link', { name: 'CV-en din, gjerne på arbeidsplassen.no (åpnes i ny fane).' });
    expect(lenke).toBeVisible();
    expect(lenke).toHaveAttribute('target', '_blank');
  });

  test('har lenke til hvor man kan klage på oppfølgingsvedtak', () => {
    const lenke = screen.getByRole('link', { name: 'kan du klage på oppfølgingsvedtaket (åpnes i ny fane).' });
    expect(lenke).toBeVisible();
    expect(lenke).toHaveAttribute('target', '_blank');
  });

  test('har lenke til hvor man kan klage på vedtak', () => {
    const lenke = screen.getByRole('link', { name: 'kan du klage på AAP-vedtaket (åpnes i ny fane).' });
    expect(lenke).toBeVisible();
    expect(lenke).toHaveAttribute('target', '_blank');
  });
});
