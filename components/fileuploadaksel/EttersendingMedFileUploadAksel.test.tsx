import { userEvent } from '@testing-library/user-event';
import { EttersendingMedFileUploadAksel } from 'components/fileuploadaksel/EttersendingMedFileUploadAksel';
import { render, screen } from 'lib/utils/test/customRender';
import { useParams } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const filnavn1 = 'fil1.pdf';
const filnavn2 = 'fil2.pdf';
const fileOne: File = new File(['fil en'], filnavn1, {
  type: 'application/pdf',
});
const fileTwo: File = new File(['fil to'], filnavn2, {
  type: 'application/pdf',
});
describe('EttersendingMedFileUploadAksel', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    vi.mocked(useParams).mockReturnValue({ locale: 'nb' });
  });

  const user = userEvent.setup();

  it('skal vise fileinput etter at ettersendelse er sendt inn dersom krav er ANNET', async () => {
    mockUploadFile();
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    const input = screen.getByLabelText('Annen dokumentasjon til din AAP-sak');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp over.'
      )
    ).toBeVisible();
    expect(screen.getByLabelText('Annen dokumentasjon til din AAP-sak')).toBeInTheDocument();
  });

  it('send knapp vises først når man har lagt til minst ett dokument', async () => {
    mockUploadFile();
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    const input = screen.getByLabelText('Annen dokumentasjon til din AAP-sak');
    await user.upload(input, fileOne);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  it('send knapp vises når krav er ANNET og filer allerede er lastet opp, og det er lagt til nye filer', async () => {
    mockUploadFile();
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    const input = screen.getByLabelText('Annen dokumentasjon til din AAP-sak');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp over.'
      )
    ).toBeVisible();
    expect(screen.getByLabelText('Annen dokumentasjon til din AAP-sak')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    const inputTwo = screen.getByLabelText('Annen dokumentasjon til din AAP-sak');
    await user.upload(inputTwo, fileTwo);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });
});

describe('FileUpload - UU', () => {
  it('vitest-axe finner ingen feil', async () => {
    mockUploadFile();
    const { container } = render(<EttersendingMedFileUploadAksel søknadId={null} />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});

function mockUploadFile() {
  fetchMock.mockResponse(JSON.stringify({ filId: uuidV4() }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('FileUploadAksel - feilhåndtering ved opplasting', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    vi.mocked(useParams).mockReturnValue({ locale: 'nb' });
  });

  const user = userEvent.setup();

  it('viser feilmelding for passordbeskyttet fil (422 PASSWORD_PROTECTED)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ substatus: 'PASSWORD_PROTECTED' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText(
        'Filen er passord-beskyttet og vil ikke kunne leses av en saksbehandler, fjern beskyttelsen og prøv igjen',
        { exact: false }
      )
    ).toBeVisible();
  });

  it('viser feilmelding for virus (422 VIRUS)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ substatus: 'VIRUS' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText('Det er oppdaget virus på filen du prøver å laste opp. Velg en annen fil å laste opp.', {
        exact: false,
      })
    ).toBeVisible();
  });

  it('viser feilmelding for størrelsesbegrensning (422 SIZE)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ substatus: 'SIZE' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText('Maksimal samlet størrelse på vedlegg per bruker (50MB) er oversteget.', { exact: false })
    ).toBeVisible();
  });

  it('viser standard feilmelding for ukjent 422-substatus', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ substatus: 'UNKNOWN_VALUE' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText(
        'Noe gikk galt i prosesseringen av filen. Prøv å laste opp dokumentet som PDF i stedet.',
        { exact: false }
      )
    ).toBeVisible();
  });

  it('viser feilmelding ved for stor fil (413, ikke-JSON svar)', async () => {
    fetchMock.mockResponseOnce('Payload Too Large', { status: 413 });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText(
        'Filen(e) du lastet opp er for stor. Last opp fil(er) med maksimal samlet størrelse 50 MB.',
        { exact: false }
      )
    ).toBeVisible();
  });

  it('viser feilmelding ved ugyldig filtype (415, ikke-JSON svar)', async () => {
    fetchMock.mockResponseOnce('Unsupported Media Type', { status: 415 });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(
      await screen.findByText(
        'Filtypen kan ikke lastes opp. Last opp dokumentet i et annet format (PDF, PNG eller JPG).',
        { exact: false }
      )
    ).toBeVisible();
  });

  it('viser generisk feilmelding ved ikke-JSON serverfeil (500)', async () => {
    fetchMock.mockResponseOnce('Internal Server Error', { status: 500 });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(await screen.findByText('Opplastingen feilet. Prøv på nytt', { exact: false })).toBeVisible();
  });

  it('viser feilmelding ved nettverksfeil (fetch kaster)', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), fileOne);
    expect(await screen.findByText('Failed to fetch', { exact: false })).toBeVisible();
  });

  it('avviser filer når samlet størrelse overskrider 50 MB, kaller ikke server, og skjuler Send inn', async () => {
    const bigFile1 = new File(['x'], 'big1.pdf', { type: 'application/pdf' });
    const bigFile2 = new File(['x'], 'big2.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile1, 'size', { value: 30 * 1024 * 1024, configurable: true });
    Object.defineProperty(bigFile2, 'size', { value: 25 * 1024 * 1024, configurable: true });

    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), [bigFile1, bigFile2]);

    expect(await screen.findAllByText('Total filstørrelse er for stor')).toHaveLength(2);
    expect(fetchMock.mock.calls).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });

  it('Send inn forblir skjult når ny batch overskrider totalen sammen med allerede opplastet fil', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ filId: uuidV4() }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    const input = screen.getByLabelText('Annen dokumentasjon til din AAP-sak');

    await user.upload(input, fileOne);
    expect(await screen.findByRole('button', { name: 'Send inn' })).toBeVisible();

    const bigFile = new File(['x'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(bigFile, 'size', { value: 50 * 1024 * 1024, configurable: true });
    await user.upload(input, bigFile);

    expect(await screen.findAllByText('Total filstørrelse er for stor')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });

  it('ved delvis opplasting: vellykket fil i liste, feilet fil viser feilmelding, Send inn skjult', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ filId: uuidV4() }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    fetchMock.mockResponseOnce(JSON.stringify({ substatus: 'VIRUS' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
    render(<EttersendingMedFileUploadAksel søknadId={null} />);
    await user.upload(screen.getByLabelText('Annen dokumentasjon til din AAP-sak'), [fileOne, fileTwo]);

    expect(await screen.findByText(filnavn1, { exact: false })).toBeVisible();
    expect(
      await screen.findByText('Det er oppdaget virus på filen du prøver å laste opp. Velg en annen fil å laste opp.', {
        exact: false,
      })
    ).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });
});
