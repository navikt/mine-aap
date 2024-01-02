import { SoknadPanel } from 'components/SoknadPanel/SoknadPanel';
import { søknadMedInnsendteOgManglendeVedlegg, søknadUtenVedlegg } from 'lib/mock/mockSoknad';
import { render, screen } from 'setUpTest';

describe('SoknadPanel', () => {
  test('har en overskrift på nivå 3', () => {
    render(<SoknadPanel søknad={søknadMedInnsendteOgManglendeVedlegg} />);

    expect(screen.getByRole('heading', { name: 'Søknad om arbeidsavklaringspenger (AAP)' })).toBeVisible();
  });

  test('har lenke til forventede saksbehandlingstider', () => {
    render(<SoknadPanel søknad={søknadMedInnsendteOgManglendeVedlegg} />);
    const lenke = screen.getByRole('link', { name: 'Se forventet saksbehandlingstid (åpnes i ny fane).' });
    expect(lenke).toBeVisible();
    expect(lenke).toHaveAttribute('target', '_blank');
  });

  test('viser varsel om manglende vedlegg når søknaden mangler vedlegg', () => {
    render(<SoknadPanel søknad={søknadMedInnsendteOgManglendeVedlegg} />);
    expect(
      screen.getByText(
        'Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så raskt du kan.'
      )
    ).toBeVisible();
  });

  test('viser alle innsendte vedlegg', () => {
    render(<SoknadPanel søknad={søknadMedInnsendteOgManglendeVedlegg} />);
    expect(screen.getByText('Dokumentasjon vi har mottatt fra deg')).toBeVisible();
  });

  test('viser ikke varsel om manglende vedlegg når søknaden ikke mangler vedlegg', () => {
    render(<SoknadPanel søknad={søknadUtenVedlegg} />);
    expect(
      screen.queryByText(
        'Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så raskt du kan.'
      )
    ).not.toBeInTheDocument();
  });
});
