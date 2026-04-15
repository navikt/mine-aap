import { userEvent } from '@testing-library/user-event';
import { Dokumentoversikt } from 'components/DokumentoversiktNy/Dokumentoversikt';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { render, screen } from 'lib/utils/test/customRender';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

describe('Dokumentoversikt', () => {
  const user = userEvent.setup();
  beforeEach(() => {
    render(<Dokumentoversikt dokumenter={mockDokumenter} />);
  });

  it('har valg for å sortere dokumentoversikten', () => {
    expect(screen.getByLabelText('Sorter etter')).toBeVisible();
  });

  it('har valg for å sortere på nyeste først', () => {
    expect(screen.getByRole('option', { name: 'Nyeste først' })).toBeVisible();
  });

  it('har valg for å sortere på eldste først', () => {
    expect(screen.getByRole('option', { name: 'Eldste først' })).toBeVisible();
  });

  it('har valg for å skjule meldekort fra listen', () => {
    expect(screen.getByRole('checkbox', { name: 'Skjul meldekort' })).toBeVisible();
  });

  it('valg for å skjule meldekort er valgt som standard', () => {
    expect(screen.getByRole('checkbox', { name: 'Skjul meldekort' })).toBeChecked();
  });

  it('viser dokumentlisten uten meldekort som standard', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(
      mockDokumenter.filter((dokument) => !dokument.tittel.includes('Meldekort for uke')).length
    );
  });

  it('viser dokumentliste med meldekort', async () => {
    const checkbox = screen.getByRole('checkbox', { name: 'Skjul meldekort' });
    await user.click(checkbox);
    expect(screen.getAllByRole('listitem')).toHaveLength(mockDokumenter.length);
  });
});

describe('Dokumentoversikt - UU', () => {
  it('vitest-axe finner ingen feil', async () => {
    const { container } = render(<Dokumentoversikt dokumenter={mockDokumenter} />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});
