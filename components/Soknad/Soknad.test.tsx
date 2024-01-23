import { Soknad } from 'components/Soknad/Soknad';
import {
  søknadMedInnsendteOgManglendeVedlegg,
  søknadMedInnsendteVedlegg,
  søknadUtenVedlegg,
} from 'lib/mock/mockSoknad';
import { render, screen } from 'setUpTest';
import { axe } from 'jest-axe';

describe('Soknad', () => {
  describe('alle søknader', () => {
    test('har overskrift på nivå 2', () => {
      render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
      expect(screen.getByRole('heading', { level: 2, name: 'Søknad om arbeidsavklaringspenger (AAP)' })).toBeVisible();
    });

    test('har knapp for å ettersende dokumentasjon', () => {
      render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
      expect(screen.getByRole('button', { name: 'Ettersend dokumentasjon' })).toBeVisible();
    });

    test('viser en liste med mottatte dokumenter', () => {
      render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
      expect(screen.getByText('Dette har vi mottatt fra deg')).toBeVisible();
      expect(screen.getByRole('link', { name: 'Søknad om AAP' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'Dokumentasjon fra arbeidsgiver' })).toBeVisible();
      expect(screen.getByRole('link', { name: 'Annen dokumentasjon' })).toBeVisible();
    });

    test('viser ingen liste dersom det ikke er sendt vedlegg', () => {
      render(<Soknad søknad={søknadUtenVedlegg} />);
      expect(screen.queryByText('Dette har vi mottatt fra deg')).not.toBeInTheDocument();
    });
  });

  describe('for søknad med manglende vedlegg', () => {
    test('vises varsel om manglende dokumentasjon', () => {
      render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
      expect(
        screen.getByText(
          'Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så raskt du kan.'
        )
      ).toBeVisible();
    });

    test('vises en liste over dokumentasjon som mangler', () => {
      render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
      expect(screen.getByText('Dokumentasjon vi mangler')).toBeVisible();
      expect(
        screen.getAllByRole('listitem').find((element) => element.textContent === 'Lønn og andre goder')
      ).toBeVisible();
    });
  });

  describe('uten manglende vedlegg', () => {
    test('vises ingen liste over manglende dokumentasjon', () => {
      render(<Soknad søknad={søknadMedInnsendteVedlegg} />);
    });

    test('vises ikke varsel om manglende dokumentasjon', () => {
      render(<Soknad søknad={søknadMedInnsendteVedlegg} />);
      expect(
        screen.queryByText(
          'Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. Ettersend dette til oss så raskt du kan.'
        )
      ).not.toBeInTheDocument();
    });
  });
});

describe('Soknad - UU', () => {
  test('jest-axe finner ingen feil', async () => {
    const { container } = render(<Soknad søknad={søknadMedInnsendteOgManglendeVedlegg} />);
    const res = await axe(container);
    expect(res).toHaveNoViolations();
  });
});
