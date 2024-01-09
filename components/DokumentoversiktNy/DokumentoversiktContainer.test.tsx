import { DokumentoversiktContainer } from 'components/DokumentoversiktNy/DokumentoversiktContainer';
import { render, screen } from 'setUpTest';
import { waitFor } from '@testing-library/dom';
import { beforeAll } from '@jest/globals';
import { mockDokumenter } from 'lib/mock/mockDokumenter';
describe('DokumentoversiktContainer', () => {
  beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDokumenter),
        })
      ) as jest.Mock
    );
  });

  test('har overskrift på nivå 2', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Dokumentoversikt' })).toBeVisible());
  });

  test('har en tekst som beskriver hva du finner på siden', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() =>
      expect(screen.getByText('Her finner du dine søknader, vedlegg, vedtak, brev og samtalerefater.')).toBeVisible()
    );
  });

  test('har en knapp som for å gi hjelp dersom det er dokumenter som ikke vises', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: 'Har du sendt en søknad eller et dokument som ikke vises her?',
        })
      ).toBeVisible()
    );
  });

  test('har en tekst som beskriver hva som kan være årsaken til at det er dokumenter som ikke vises i oversikten', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() =>
      expect(
        screen.getByText(
          'Det kan ta noen minutter fra du har sendt en digital søknad til den vises i oversikten. Hvis du har sendt en søknad i posten tar det som regel 2 uker fra den er postlagt til den vises i dokumentoversikten.'
        )
      ).toBeVisible()
    );
  });

  test('viser skeletonLoader når dokumentene hentes inn', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() => expect(screen.getByTestId('skeletonLoader')).toBeInTheDocument());
  });

  test('viser dokumentoversikt når dokumentene er hentet inn', async () => {
    render(<DokumentoversiktContainer />);
    await waitFor(() => expect(screen.getByText(mockDokumenter[0].tittel)).toBeVisible());
  });
});
