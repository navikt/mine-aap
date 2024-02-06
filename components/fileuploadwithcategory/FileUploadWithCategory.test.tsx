import { render, screen } from 'setUpTest';
import { enableFetchMocks } from 'jest-fetch-mock';
import { v4 as uuidV4 } from 'uuid';

import { FileUploadWithCategory } from 'components/fileuploadwithcategory/FileUploadWithCategory';
import { userEvent } from '@testing-library/user-event';

enableFetchMocks();
const filnavn1 = 'fil1.pdf';

const filEn: File = new File(['fil en'], filnavn1, { type: 'application/json' });
describe('FileUploadWithCategory', () => {
  const user = userEvent.setup();
  const addError = jest.fn();
  const deleteError = jest.fn();

  beforeEach(() => [jest.resetAllMocks()]);
  test('har en overskrift', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByRole('heading', { name: 'Dokumentasjon til din AAP-sak' })).toBeVisible();
  });

  test('beskriver formålet', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(
      screen.getByText(
        'Her kan du laste opp dokumenter til din AAP-sak. Velg hva dokumentet inneholder fra nedtrekkslisten'
      )
    ).toBeVisible();
  });

  test('har valg for hvilken dokumenttype som lastes opp', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByLabelText('Hva inneholder dokumentet?')).toBeVisible();
  });

  test('har valg for alle filtyper', () => {
    render(<FileUploadWithCategory addError={addError} deleteError={deleteError} />);
    expect(screen.getByRole('option', { name: 'Bekreftelse på avbrutt studie' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Lønn og andre goder' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Omsorgsstønad (tidligere omsorgslønn)' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Ytelser fra utenlandske trygdemyndigheter' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Andre barn' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Annen dokumentasjon til din AAP-sak' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Sykestipend fra lånekassen' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Studielån fra lånekassen' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Utbetalinger fra utendlandske trygdemyndigheter' })).toBeVisible();
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
});

function mockUploadFile() {
  fetchMock.mockResponseOnce(JSON.stringify(uuidV4()), { status: 200 });
}
