import { Dokumentrad } from 'components/DokumentoversiktNy/Dokumentrad/Dokumentrad';
import type { Dokument } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';
import { dokumentTittel } from 'lib/utils/dokumentOversikt';
import { render, screen } from 'lib/utils/test/customRender';
import { describe, expect, it } from 'vitest';

const inngåendeDokument: Dokument = {
  tittel: 'Søknad om AAP',
  dato: new Date().toString(),
  dokumentId: 'dokumentid',
  type: 'I',
  innsendingId: 'innsendingsid',
  journalpostId: 'journalpostid',
};
describe('Dokumentrad', () => {
  it('er et liste-element', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('har lenke med tittel på dokumentet', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);
    expect(screen.getByRole('link', { name: dokumentTittel(inngåendeDokument) })).toBeVisible();
  });

  it('lenke åpnes i ny fane', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);
    expect(screen.getByRole('link', { name: dokumentTittel(inngåendeDokument) })).toHaveAttribute('target', '_blank');
  });

  it('viser at dokumentet er sendt av Nav når type er U', () => {
    const utgåendeDokument: Dokument = { ...inngåendeDokument, type: 'U' };
    render(<Dokumentrad dokument={utgåendeDokument} />);

    expect(screen.getByText(/^Sendt av Nav/)).toBeVisible();
  });

  it('viser at dokumentet er sendt av Nav når type er N', () => {
    const utgåendeDokument: Dokument = { ...inngåendeDokument, type: 'N' };
    render(<Dokumentrad dokument={utgåendeDokument} />);

    expect(screen.getByText(/^Sendt av Nav/)).toBeVisible();
  });

  it('viser at dokumentet er sendt av bruker (deg) når type er I', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);

    expect(screen.getByText(/^Sendt av deg/)).toBeVisible();
  });

  it('viser dato for når dokumentet ble sendt / mottatt', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);

    const forventetDato = formatDate(inngåendeDokument.dato);
    expect(screen.getByText(forventetDato, { exact: false })).toBeVisible();
  });

  it('har en beskrivelse som sier hvem dokumentet ble sendt av, og når', () => {
    render(<Dokumentrad dokument={inngåendeDokument} />);
    const forventetBeskrivelse = `Sendt av deg den ${formatDate(inngåendeDokument.dato)}`;
    expect(screen.getByText(forventetBeskrivelse)).toBeVisible();
  });
});
