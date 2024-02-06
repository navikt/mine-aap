import { SoknadInnsending } from 'components/Soknad/SoknadInnsending';
import { InnsendingSøknad } from 'lib/types/types';
import { render, screen } from 'setUpTest';

const mockSøknad: InnsendingSøknad = {
  innsendingsId: '123',
  journalpostId: '123',
  mottattDato: '2024-01-1',
};

describe('SoknadInnsending', () => {
  test('Skal rendre komponent for søknad uten ettersendelser', () => {
    render(<SoknadInnsending søknad={mockSøknad} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Søknad om arbeidsavklaringspenger (AAP)' })).toBeVisible();
  });
});
