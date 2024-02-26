import { SoknadInnsending } from 'components/Soknad/SoknadInnsending';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
import { InnsendingSøknad } from 'lib/types/types';
import { render, screen, waitFor } from 'setUpTest';

const mockSøknad: InnsendingSøknad = {
  innsendingsId: '123',
  journalpostId: '123',
  mottattDato: '2024-01-1',
};

describe('SoknadInnsending', () => {
  beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDokumenter),
        })
      ) as jest.Mock
    );
  });
  test('Skal rendre komponent for søknad uten ettersendelser', async () => {
    render(<SoknadInnsending søknad={mockSøknad} />);
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2, name: 'Søknad om arbeidsavklaringspenger (AAP)' })).toBeVisible()
    );
  });
});
