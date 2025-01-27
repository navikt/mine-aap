import { Dokumentrad } from 'components/DokumentoversiktNy/Dokumentrad/Dokumentrad';
import { render, screen } from 'setUpTest';
import { Dokument } from 'lib/types/types';
import { formatDate } from 'lib/utils/date';

const inngåendeDokument: Dokument = {
  tittel: 'Søknad om AAP',
  dato: new Date().toString(),
  dokumentId: 'dokumentid',
  type: 'I',
  innsendingsId: 'innsendingsid',
  journalpostId: 'journalpostid',
};
describe('Dokumentrad', () => {
  test('er et liste-element', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  test('har lenke med tittel på dokumentet', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);
    expect(screen.getByRole('link', { name: inngåendeDokument.tittel })).toBeVisible();
  });

  test('lenke åpnes i ny fane', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);
    expect(screen.getByRole('link', { name: inngåendeDokument.tittel })).toHaveAttribute('target', '_blank');
  });

  test('viser at dokumentet er sendt av Nav når type er U', () => {
    const utgåendeDokument: Dokument = { ...inngåendeDokument, type: 'U' };
    render(<Dokumentrad dokument={utgåendeDokument} antallSider={1} />);

    expect(screen.getByText(/^Sendt av Nav/)).toBeVisible();
  });

  test('viser at dokumentet er sendt av bruker (deg) når type er I', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);

    expect(screen.getByText(/^Sendt av deg/)).toBeVisible();
  });

  test('viser at dokumentet har ukjent avsender hvis type er noe annet enn U eller I', () => {
    const ukjentDokumenttype: Dokument = { ...inngåendeDokument, type: 'N' };
    render(<Dokumentrad dokument={ukjentDokumenttype} antallSider={1} />);

    expect(screen.getByText(/^Sendt av Ukjent/)).toBeVisible();
  });

  test('viser dato for når dokumentet ble sendt / mottatt', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);

    const forventetDato = formatDate(inngåendeDokument.dato);
    expect(screen.getByText(forventetDato, { exact: false })).toBeVisible();
  });

  test('har en beskrivelse som sier hvem dokumentet ble sendt av, og når', () => {
    render(<Dokumentrad dokument={inngåendeDokument} antallSider={1} />);
    const forventetBeskrivelse = `Sendt av deg den ${formatDate(inngåendeDokument.dato)}`;
    expect(screen.getByText(forventetBeskrivelse)).toBeVisible();
  });
});
