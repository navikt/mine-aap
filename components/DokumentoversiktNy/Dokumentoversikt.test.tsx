import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { render, screen } from 'setUpTest';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';

describe('Dokumentoversikt', () => {
  const user = userEvent.setup();
  beforeEach(() => {
    render(<Dokumentoversikt dokumenter={mockDokumenter} />);
  });

  test('har valg for å sortere dokumentoversikten', () => {
    expect(screen.getByLabelText('Sorter etter')).toBeVisible();
  });

  test('har valg for å sortere på nyeste først', () => {
    expect(screen.getByRole('option', { name: 'Nyeste først' })).toBeVisible();
  });

  test('har valg for å sortere på eldste først', () => {
    expect(screen.getByRole('option', { name: 'Eldste først' })).toBeVisible();
  });

  test('har valg for å skjule meldekort fra listen', () => {
    expect(screen.getByRole('checkbox', { name: 'Skjul meldekort' })).toBeVisible();
  });

  test('valg for å skjule meldekort er valgt som standard', () => {
    expect(screen.getByRole('checkbox', { name: 'Skjul meldekort' })).toBeChecked();
  });

  test('viser dokumentlisten uten meldekort som standard', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(
      mockDokumenter.filter((dokument) => !dokument.tittel.includes('Meldekort for uke')).length
    );
  });

  test('viser dokumentliste med meldekort', async () => {
    const checkbox = screen.getByRole('checkbox', { name: 'Skjul meldekort' });
    await user.click(checkbox);
    expect(screen.getAllByRole('listitem')).toHaveLength(mockDokumenter.length);
  });
});

describe('Dokumentoversikt - UU', () => {
  test('jest-axe finner ingen feil', async () => {
    const { container } = render(<Dokumentoversikt dokumenter={mockDokumenter} />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});
