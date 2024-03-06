import React from 'react';
import { render, screen } from 'setUpTest';
import { enableFetchMocks } from 'jest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { v4 as uuidV4 } from 'uuid';
import { axe } from 'jest-axe';
import { FileUploadV2 } from 'components/fileupload_v2/FileUploadV2';

enableFetchMocks();
const filnavn1 = 'fil1.pdf';
const fileOne: File = new File(['fil en'], filnavn1, { type: 'application/pdf' });
describe('FileUploadV2', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const user = userEvent.setup();

  test('har overskrift på nivå 1', () => {
    render(<Filopplastning />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dokumentasjon til din AAP-sak' })).toBeVisible();
  });

  test('viser en beskrivelse av hva siden er til', () => {
    render(<Filopplastning />);
    expect(
      screen.getByText('Her kan du laste opp dokumenter til din AAP-sak. Velg hva dokumentet inneholder fra listen.')
    ).toBeVisible();
  });

  test('viser nedtrekksmeny for å velge vedleggstype', () => {
    render(<Filopplastning />);
    expect(screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' })).toBeVisible();
  });

  test('viser en beskrivelse av vedleggstypen når man har valgt vedleggstype', async () => {
    const forventetBeskrivelse = 'Kopi av avtalen om omsorgsstønad fra kommunen din.';

    render(<Filopplastning />);
    expect(screen.queryByText(forventetBeskrivelse)).not.toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }),
      'Omsorgsstønad (tidligere omsorgslønn)'
    );
    expect(screen.getByText(forventetBeskrivelse)).toBeVisible();
  });

  test('viser fileinput når man har valgt dokumenttype', async () => {
    render(<Filopplastning />);
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }),
      'Lønn og andre goder'
    );
    expect(screen.getByLabelText(/Velg filer for dokumentasjon til din AAP-sak/)).toBeVisible();
  });

  test('send knapp vises først når man har lagt til minst ett dokument', async () => {
    mockUploadFile();
    render(<Filopplastning />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }),
      'Omsorgsstønad (tidligere omsorgslønn)'
    );

    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  test('viser suksessmelding når man sender inn ettersendelse', async () => {
    mockUploadFile();
    render(<Filopplastning />);
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }),
      'Omsorgsstønad (tidligere omsorgslønn)'
    );

    const input = screen.getByTestId('fileinput');
    await user.upload(input, fileOne);
    expect(await screen.findByText(filnavn1)).toBeVisible();
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });
    expect(sendInnKnapp).toBeVisible();
    await user.click(sendInnKnapp);
    expect(await screen.findByText('Takk! Dokumentasjonen er nå sendt inn!')).toBeVisible();
  });
});

describe('FileUpload - UU', () => {
  test('jest-axe finner ingen feil', async () => {
    mockUploadFile();
    const { container } = render(<Filopplastning />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});

const Filopplastning = () => <FileUploadV2 addError={jest.fn} deleteError={jest.fn} setErrorSummaryFocus={jest.fn} />;
function mockUploadFile() {
  fetchMock.mockResponseOnce(JSON.stringify({ filId: uuidV4() }), { status: 200 });
}
