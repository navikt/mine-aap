import { render as renderWithoutProvider } from '@testing-library/react';
import messages from 'lib/translations/nb.json';
import { render, screen } from 'lib/utils/test/customRender';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { StatusTagOgBeskrivelse } from './StatusTagOgBeskrivelse';

describe('StatusTagOgBeskrivelse', () => {
  it('viser bare taggen når konfigurasjonen ikke angir beskrivelse', () => {
    const { container } = render(<StatusTagOgBeskrivelse navn="ALDER_LOVVALG_MEDLEMSKAP" status="AUTOMATISK_SJEKK" />);

    expect(screen.getByText('Automatisk sjekk')).toBeVisible();
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(container.querySelector('p')).toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('viser tag og beskrivelse for statusen på Nav-kontoret', () => {
    render(<StatusTagOgBeskrivelse navn="NAV_KONTOR" status="VENTER_PÅ_LEGEERKLÆRING" />);

    expect(screen.getByText('Venter på legeerklæring')).toBeVisible();
    expect(screen.getByText(messages.statusisak.navKontor.status.beskrivelse.venterPåLegeerklæring)).toBeVisible();
  });

  it('viser bare beskrivelsen når konfigurasjonen ikke angir tag', () => {
    const { container } = render(<StatusTagOgBeskrivelse navn="FERDIG_BEHANDLET" status="SØKNAD_GODKJENT" />);

    expect(screen.getByText('Søknaden din om AAP er godkjent.')).toBeVisible();
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(container.firstElementChild?.firstElementChild?.tagName).toBe('P');
    expect(container.querySelector('svg')).toBeNull();
  });

  it.each([undefined, null])('viser ingenting når status er %s', (status) => {
    const { container } = render(<StatusTagOgBeskrivelse navn="ALDER_LOVVALG_MEDLEMSKAP" status={status} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('viser ingenting når statusen er eksplisitt skjult i konfigurasjonen', () => {
    const { container } = render(
      <StatusTagOgBeskrivelse
        navn="ALDER_LOVVALG_MEDLEMSKAP"
        status="MOTTATT_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ['ALDER_LOVVALG_MEDLEMSKAP', 'Vi venter på informasjon fra utenlandske myndigheter.'],
    [
      'NAY',
      'Vi venter på dokumentasjon fra utenlandske myndigheter. Vi trenger dokumentasjon for å ferdigbehandle søknaden.',
    ],
  ] as const)('bruker beskrivelsen for hendelsen %s', (navn, beskrivelse) => {
    render(<StatusTagOgBeskrivelse navn={navn} status="VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER" />);

    expect(screen.getByText('Venter på utenlandske myndigheter')).toBeVisible();
    expect(screen.getByText(beskrivelse)).toBeVisible();
  });

  it('viser beskrivelsen for en godkjent søknad', () => {
    render(<StatusTagOgBeskrivelse navn="FERDIG_BEHANDLET" status="SØKNAD_GODKJENT" />);

    expect(screen.getByText('Søknaden din om AAP er godkjent.')).toBeVisible();
  });

  it('viser ingenting for en hendelse uten statuskonfigurasjon', () => {
    const { container } = render(<StatusTagOgBeskrivelse navn="SØKNAD_MOTTATT" status="AUTOMATISK_SJEKK" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('viser tag og beskrivelse med klokke når legeerklæringen er purret på', () => {
    const { container } = render(<StatusTagOgBeskrivelse navn="NAV_KONTOR" status="PURRET_PÅ_LEGERERKLÆRING" />);

    expect(screen.getByText('Purret på legeerklæring')).toBeVisible();
    expect(screen.getByText(messages.statusisak.navKontor.status.beskrivelse.purretPåLegeerklæring)).toBeVisible();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('viser ikke klokke eller ekstra beskrivelse for mottatt legeerklæring selv om oversettelsen finnes', () => {
    const { container } = renderWithoutProvider(
      <NextIntlClientProvider
        locale="nb"
        messages={{
          statusisak: {
            navKontor: {
              status: {
                tag: { mottattLegeerklæring: 'Mottatt legeerklæring' },
                beskrivelse: { mottattLegeerklæring: 'Denne teksten skal ikke vises.' },
              },
            },
          },
        }}
      >
        <StatusTagOgBeskrivelse navn="NAV_KONTOR" status="MOTTATT_LEGEERKLÆRING" />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Mottatt legeerklæring')).toBeVisible();
    expect(container.querySelector('p')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('rapporterer manglende konfigurert oversettelse i stedet for å skjule taggen', () => {
    const onError = vi.fn();
    const { container } = renderWithoutProvider(
      <NextIntlClientProvider locale="nb" messages={{ statusisak: {} }} onError={onError}>
        <StatusTagOgBeskrivelse navn="ALDER_LOVVALG_MEDLEMSKAP" status="AUTOMATISK_SJEKK" />
      </NextIntlClientProvider>
    );

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'MISSING_MESSAGE' }));
    expect(container).not.toBeEmptyDOMElement();
  });
});
