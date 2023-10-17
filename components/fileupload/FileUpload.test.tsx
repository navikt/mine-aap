import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileUpload } from 'components/fileupload/FileUpload';
import { IntlWrapper } from 'test-utils/IntlWrapper';
import { enableFetchMocks } from 'jest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';

enableFetchMocks();
const fileOne: File = new File(['fil en'], 'fila.pdf', { type: 'application/pdf' });
const fileTwo: File = new File(['fil en'], 'fila_v2.pdf', { type: 'application/pdf' });
describe('FileUpload', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const user = userEvent.setup();

  it('skal vise suksessmelding når man sender inn ettersendelse', async () => {
    mockUploadFile();
    render(
      <IntlWrapper>
        <FileUpload
          krav={'UTLAND'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(await screen.findByText('fila.pdf')).toBeVisible();
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
    render(
      <IntlWrapper>
        <FileUpload
          krav={'UTLAND'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
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
    render(
      <IntlWrapper>
        <FileUpload
          krav={'ANNET'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
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

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('send knapp vises først når man har lagt til minst ett dokument', async () => {
    mockUploadFile();
    render(
      <IntlWrapper>
        <FileUpload
          krav={'ANNET'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  it('send knapp vises ikke når krav ikke er ANNET og filer er lastet opp', async () => {
    mockUploadFile();
    render(
      <IntlWrapper>
        <FileUpload
          krav={'OMSORG'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(sendInnKnapp);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });

  it('send knapp vises når krav er ANNET og filer allerede er lastet opp, og det er lagt til nye filer', async () => {
    mockUploadFile();
    render(
      <IntlWrapper>
        <FileUpload
          krav={'ANNET'}
          addError={jest.fn}
          deleteError={jest.fn}
          setErrorSummaryFocus={jest.fn}
          onSuccess={jest.fn}
        />
      </IntlWrapper>
    );
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

function mockUploadFile() {
  fetchMock.mockResponseOnce(JSON.stringify(uuidV4()), { status: 200 });
}
