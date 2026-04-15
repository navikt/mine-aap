import React from 'react';
import { render, screen } from 'lib/utils/test/customRender';
import { FileUpload } from 'components/fileupload/FileUpload';
import createFetchMock from 'vitest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';
import { VedleggType } from 'lib/types/types';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useParams } from 'next/navigation';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const filnavn1 = 'fil1.pdf';
const filnavn2 = 'fil2.pdf';
const fileOne: File = new File(['fil en'], filnavn1, { type: 'application/pdf' });
const fileTwo: File = new File(['fil to'], filnavn2, { type: 'application/pdf' });
describe('FileUpload', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    vi.mocked(useParams).mockReturnValue({ locale: 'nb' });
  });

  const user = userEvent.setup();

  it('skal vise suksessmelding når man sender inn ettersendelse', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'OMSORG'} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(await screen.findByText(filnavn1)).toBeVisible();
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    expect(sendInnKnapp).toBeVisible();
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp under "Annen dokumentasjon".'
      )
    ).toBeVisible();
  });

  it('skal ikke vise fileinput etter at ettersendelse er sendt inn dersom krav ikke er ANNET', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'UTLAND'} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp under "Annen dokumentasjon".'
      )
    ).toBeVisible();
    expect(screen.queryByTestId('fileinput')).not.toBeInTheDocument();
  });

  it('skal vise fileinput etter at ettersendelse er sendt inn dersom krav er ANNET', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'ANNET'} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp over.'
      )
    ).toBeVisible();
    expect(screen.getByTestId('fileinput')).toBeInTheDocument();
  });

  it('send knapp vises først når man har lagt til minst ett dokument', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'ANNET'} />);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  it('send knapp vises ikke når krav ikke er ANNET og filer er lastet opp', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'UTLAND'} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });

  it('send knapp vises når krav er ANNET og filer allerede er lastet opp, og det er lagt til nye filer', async () => {
    mockUploadFile();
    render(<Filopplastning krav={'ANNET'} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(
      await screen.findByText(
        'Takk! Dokumentasjonen er nå sendt inn! Har du flere dokumenter du ønsker å sende, kan du laste de opp over.'
      )
    ).toBeVisible();
    expect(screen.getByTestId('fileinput')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    await user.upload(screen.getByTestId('fileinput'), fileTwo);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });
});

describe('FileUpload - UU', () => {
  it('vitest-axe finner ingen feil', async () => {
    mockUploadFile();
    const { container } = render(<Filopplastning krav={'ANNET'} />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});

const Filopplastning = ({ krav }: { krav: VedleggType }) => (
  <FileUpload krav={krav} addError={vi.fn()} deleteError={vi.fn()} setErrorSummaryFocus={vi.fn()} onSuccess={vi.fn()} />
);
function mockUploadFile() {
  fetchMock.mockResponseOnce(JSON.stringify(uuidV4()), { status: 200 });
}
