import { render, screen } from 'setUpTest';
import { enableFetchMocks } from 'jest-fetch-mock';
import { v4 as uuidV4 } from 'uuid';

import { FileUploadWithCategory } from 'components/fileuploadwithcategory/FileUploadWithCategory';
import { userEvent } from '@testing-library/user-event';

enableFetchMocks();
const filnavn1 = 'fil1.pdf';

const filEn: File = new File(['fil en'], filnavn1, { type: 'application/pdf' });
describe('FileUploadWithCategory', () => {
  const user = userEvent.setup();
  const addError = jest.fn();
  const deleteError = jest.fn();

  beforeEach(() => [jest.resetAllMocks()]);
  test('har en overskrift', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByRole('heading', { name: 'Dokumentasjon til din AAP-sak' })).toBeVisible();
  });

  test('beskriver formålet med komponenten', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(
      screen.getByText('Her kan du laste opp dokumenter til din AAP-sak. Velg hva dokumentet inneholder fra listen.')
    ).toBeVisible();
  });

  test('har valg for hvilken dokumenttype som lastes opp', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByLabelText('Hva inneholder dokumentet?')).toBeVisible();
  });

  test('har undefined som initiell verdi for dokumenttype', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' })).toHaveValue(undefined);
  });

  test('har valg for alle dokumenttyper', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByRole('option', { name: 'Bekreftelse på avbrutt studie' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Lønn og andre goder' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Omsorgsstønad (tidligere omsorgslønn)' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Ytelser fra utenlandske trygdemyndigheter' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Andre barn' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Annen dokumentasjon til din AAP-sak' })).toBeVisible();
  });

  test('setter verdi når man velger en dokumenttype', async () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }), 'ANDREBARN');
    expect(screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' })).toHaveValue('ANDREBARN');
  });

  test('fjerner feilmelding fra dokumenttype når man velger et dokument', async () => {
    mockUploadFile();
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, filEn);
    await user.click(screen.getByRole('button', { name: 'Send inn' }));
    expect(screen.getByText('Du må velge hvilken type dokumentasjon du laster opp før du kan fullføre.')).toBeVisible();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Hva inneholder dokumentet?' }), 'ANDREBARN');
    expect(
      screen.queryByText('Du må velge hvilken type dokumentasjon du laster opp før du kan fullføre.')
    ).not.toBeInTheDocument();
  });

  test('viser ikke knapp for å sende inn så lenge det ikke er lastet opp et dokument', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.queryByRole('button', { name: 'Send inn' })).not.toBeInTheDocument();
  });

  test('viser knapp for å sende inn når det er lastet opp et dokument', async () => {
    mockUploadFile();
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, filEn);
    expect(screen.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  test('kan slette et opplastet dokument', async () => {
    mockUploadFile();
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, filEn);
    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt Avbryt' });
    expect(avbrytKnapp).toBeVisible();
    await user.click(avbrytKnapp);
    expect(screen.queryByText(filnavn1)).not.toBeInTheDocument();
  });

  test('viser feilmelding dersom man trykker send inn uten å ha valgt kategori', async () => {
    mockUploadFile();
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    const input = screen.getByTestId('fileinput');
    await user.upload(input, filEn);
    await user.click(screen.getByRole('button', { name: 'Send inn' }));
    expect(screen.getByText('Du må velge hvilken type dokumentasjon du laster opp før du kan fullføre.')).toBeVisible();
  });
});

function mockUploadFile() {
  fetchMock.mockResponseOnce(JSON.stringify(uuidV4()), { status: 200 });
}
