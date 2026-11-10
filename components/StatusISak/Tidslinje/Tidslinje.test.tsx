// import { userEvent } from '@testing-library/user-event';
// import { render, screen } from 'lib/utils/test/customRender';
// import { NextIntlClientProvider } from 'next-intl';
// import type { ComponentType } from 'react';
// import { describe, expect, it, vi } from 'vitest';
// import { axe } from 'vitest-axe';
// import { Tidslinje } from './Tidslinje';
// import { AlderLovvalgMedlemskap } from './TidslinjeSteg/AlderLovvalgMedlemskap/AlderLovvalgMedlemskap';
// import { FerdigBehandlet } from './TidslinjeSteg/FerdigBehandlet/FerdigBehandlet';
// import { NavKontor } from './TidslinjeSteg/NavKontor/NavKontor';
// import { SoknadMottatt } from './TidslinjeSteg/SoknadMottatt/SoknadMottatt';
// import { TidslinjeSteg } from './TidslinjeSteg/TidslinjeSteg';
// import type { HendelseStegProps } from './TidslinjeSteg/types';
// import { UnderBehandling } from './TidslinjeSteg/UnderBehandling/UnderBehandling';

// const hendelseSteg: {
//   navn: BehandlingHendelseNavn;
//   Steg: ComponentType<HendelseStegProps>;
//   title: string;
//   content: string;
// }[] = [
//   {
//     navn: 'SØKNAD_MOTTATT',
//     Steg: SoknadMottatt,
//     title: 'Søknaden din er mottatt',
//     content: 'Dette steget gjelder mottak av søknaden din.',
//   },
//   {
//     navn: 'ALDER_LOVVALG_MEDLEMSKAP',
//     Steg: AlderLovvalgMedlemskap,
//     title: 'Vi sjekker søknaden din',
//     content: 'Vi vurderer alder, lovvalg og medlemskap i folketrygden.',
//   },
//   {
//     navn: 'NAV_KONTOR',
//     Steg: NavKontor,
//     title: 'Vi kartlegger situasjonen din',
//     content:
//       'I kartleggingen samarbeider vi med deg, legen og arbeidsgiveren din. Vi kartlegger også hvordan skaden eller sykdommen din påvirker mulighetene til å jobbe og motta oppfølging fra Nav. Oppfølging får du tilbud om i eget brev.',
//   },
//   {
//     navn: 'UNDER_BEHANDLING',
//     Steg: UnderBehandling,
//     title: 'Vi behandler siste del av søknaden din',
//     content: 'Dette steget gjelder den siste delen av behandlingen av søknaden din.',
//   },
//   {
//     navn: 'FERDIG_BEHANDLET',
//     Steg: FerdigBehandlet,
//     title: 'Du får svar',
//     content: 'Når søknaden er ferdig behandlet, får du svar i et vedtak.',
//   },
// ];
//
// const behandling: Behandling = {
//   behandlingId: 'behandling1',
//   behandlingType: 'SØKNAD',
//   navn: 'Søknad om arbeidsavklaringspenger',
//   vedtakFattet: false,
//   opprettet: '2026-01-01',
//   hendelser: [
//     { navn: 'SØKNAD_MOTTATT', timestamp: '2026-01-01', progresjon: 'fullført' },
//     { navn: 'NAV_KONTOR', timestamp: '2026-01-01', progresjon: 'aktiv', status: 'VENTER_PÅ_LEGEERKLÆRING' },
//     { navn: 'FERDIG_BEHANDLET', timestamp: '2026-01-01', progresjon: 'ikke-påbegynt' },
//   ],
// };
//
// describe('Tidslinje', () => {
//   it('viser stegene i rekkefølge med tydelig status og åpner bare det aktive steget', () => {
//     render(<Tidslinje behandling={behandling} />);
//     const buttons = screen.getAllByRole('button');
//     expect(buttons).toHaveLength(3);
//     expect(buttons[0]).toHaveAccessibleName('Søknaden din er mottatt Fullført steg');
//     expect(buttons[1]).toHaveAccessibleName('Vi kartlegger situasjonen din Pågående steg');
//     expect(buttons[2]).toHaveAccessibleName('Du får svar Ikke påbegynt');
//     expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual(['false', 'true', 'false']);
//     expect(screen.getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step');
//     expect(screen.getByText(/I kartleggingen samarbeider vi med deg/)).toBeVisible();
//   });
//
//   it('lukker det forrige steget når et annet steg åpnes, og lar alle steg lukkes', async () => {
//     const user = userEvent.setup();
//     render(<Tidslinje behandling={behandling} />);
//     const buttons = screen.getAllByRole('button');
//     await user.click(buttons[0]);
//     expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false']);
//     expect(screen.getAllByRole('listitem').map((step) => step.getAttribute('data-expanded'))).toEqual([
//       'true',
//       'false',
//       'false',
//     ]);
//     await user.click(buttons[2]);
//     expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'true']);
//     await user.click(buttons[2]);
//     expect(buttons.map((button) => button.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'false']);
//   });
//
//   it('oppdaterer ekspansjonstilstanden på stegene når aktivt steg lukkes og andre steg åpnes', async () => {
//     const user = userEvent.setup();
//     render(<Tidslinje behandling={behandling} />);
//     const buttons = screen.getAllByRole('button');
//     const expandedSteps = () => screen.getAllByRole('listitem').map((step) => step.getAttribute('data-expanded'));
//
//     expect(expandedSteps()).toEqual(['false', 'true', 'false']);
//     await user.click(buttons[1]);
//     expect(expandedSteps()).toEqual(['false', 'false', 'false']);
//     await user.click(buttons[0]);
//     expect(expandedSteps()).toEqual(['true', 'false', 'false']);
//     await user.click(buttons[2]);
//     expect(expandedSteps()).toEqual(['false', 'false', 'true']);
//   });
//
//   it('støtter tastaturbetjening', async () => {
//     const user = userEvent.setup();
//     render(<Tidslinje behandling={behandling} />);
//     await user.tab();
//     const button = screen.getAllByRole('button')[0];
//     expect(button).toHaveFocus();
//     await user.keyboard('{Enter}');
//     expect(button).toHaveAttribute('aria-expanded', 'true');
//     await user.keyboard(' ');
//     expect(button).toHaveAttribute('aria-expanded', 'false');
//   });
//
//   it('knytter hver knapp til et panel som skjules og vises', async () => {
//     const user = userEvent.setup();
//     render(<Tidslinje behandling={behandling} />);
//     const button = screen.getAllByRole('button')[1];
//     const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
//     expect(panel).toBeVisible();
//     await user.click(button);
//     expect(panel).not.toBeVisible();
//     await user.click(button);
//     expect(panel).toBeVisible();
//   });
//
//   it('bevarer begge avsnittene og uthevet informasjon i kartleggingssteget', () => {
//     render(<Tidslinje behandling={behandling} />);
//     expect(screen.getByText(hendelseSteg[2].content)).toBeVisible();
//     expect(screen.getByText(/Kartleggingen tar 1-2 måneder/)).toBeVisible();
//     expect(screen.getByText('Du hører fra oss hvis det trengs.').tagName).toBe('STRONG');
//   });
//
//   it('viser dato for fullførte steg og relative tidsangivelser for nåværende og fremtidige steg', () => {
//     render(<Tidslinje behandling={behandling} />);
//     expect(screen.getByText('1. januar 2026')).toHaveAttribute('datetime', '2026-01-01');
//     expect(screen.getByText('Nå')).toBeInTheDocument();
//     expect(screen.getByText('Senere')).toBeInTheDocument();
//   });
//
//   it.each([
//     {
//       progresjon: 'fullført' as const,
//       title: 'Vi har sjekket søknaden din Fullført steg',
//       label: '1. januar 2026',
//       content: 'Vi venter på informasjon fra utenlandske myndigheter.',
//     },
//     {
//       progresjon: 'aktiv' as const,
//       title: 'Vi sjekker søknaden din Pågående steg',
//       label: 'Nå',
//       content: 'Vi venter på informasjon fra utenlandske myndigheter.',
//     },
//     {
//       progresjon: 'ikke-påbegynt' as const,
//       title: 'Vi sjekker søknaden din Ikke påbegynt',
//       label: 'Senere',
//       content: 'Vi vurderer alder, lovvalg og medlemskap i folketrygden.',
//     },
//   ])('bevarer variantdetaljer for $progresjon', async ({ progresjon, title, label, content }) => {
//     const user = userEvent.setup();
//     render(
//       <Tidslinje
//         behandling={{
//           ...behandling,
//           hendelser: [
//             {
//               navn: 'ALDER_LOVVALG_MEDLEMSKAP',
//               timestamp: '2026-01-01',
//               progresjon,
//               status: 'VENTER_PÅ_INFORMASJON_FRA_UTENLANDSKE_MYNDIGHETER',
//             },
//           ],
//         }}
//       />
//     );
//
//     const button = screen.getByRole('button', { name: title });
//     const step = screen.getByRole('listitem');
//     expect(step).toHaveAttribute('data-progresjon', progresjon);
//     expect(screen.getByText(label)).toBeInTheDocument();
//     expect(button).toHaveAttribute('aria-expanded', progresjon === 'aktiv' ? 'true' : 'false');
//
//     if (progresjon === 'fullført') {
//       expect(button).toHaveAccessibleDescription(label);
//       expect(document.getElementById(button.getAttribute('aria-describedby') ?? '')).toHaveAttribute(
//         'datetime',
//         '2026-01-01'
//       );
//     } else {
//       expect(button).not.toHaveAttribute('aria-describedby');
//     }
//
//     if (progresjon === 'aktiv') {
//       expect(step).toHaveAttribute('aria-current', 'step');
//     } else {
//       expect(step).not.toHaveAttribute('aria-current');
//       await user.click(button);
//     }
//
//     expect(screen.getByText(content)).toBeVisible();
//     await user.click(button);
//     expect(screen.getByText(content)).not.toBeVisible();
//   });
//
//   it('bevarer standardbeskrivelsen uten ventestatus og Oslo-tid for fullførte steg', async () => {
//     const user = userEvent.setup();
//     render(
//       <Tidslinje
//         behandling={{
//           ...behandling,
//           hendelser: [{ navn: 'SØKNAD_MOTTATT', timestamp: '2026-01-01T23:30:00Z', progresjon: 'fullført' }],
//         }}
//       />
//     );
//     expect(screen.getByText('2. januar 2026')).toHaveAttribute('datetime', '2026-01-01T23:30:00Z');
//     await user.click(screen.getByRole('button'));
//     expect(screen.getByText('Dette steget gjelder mottak av søknaden din.')).toBeVisible();
//   });
//
//   it('viser ingenting når det ikke finnes hendelser', () => {
//     render(<Tidslinje behandling={{ ...behandling, hendelser: [] }} />);
//     expect(screen.queryByRole('list')).not.toBeInTheDocument();
//   });
//
//   it('åpner bare det første aktive steget når flere hendelser er aktive', () => {
//     render(
//       <Tidslinje
//         behandling={{
//           ...behandling,
//           hendelser: behandling.hendelser.map((hendelse) => ({ ...hendelse, progresjon: 'aktiv' })),
//         }}
//       />
//     );
//     expect(screen.getAllByRole('button').map((button) => button.getAttribute('aria-expanded'))).toEqual([
//       'true',
//       'false',
//       'false',
//     ]);
//   });
//
//   it('bevarer nynorsk datoformatering og tilgjengelig datobeskrivelse', () => {
//     render(
//       <NextIntlClientProvider locale="nn">
//         <Tidslinje
//           behandling={{
//             ...behandling,
//             hendelser: [{ navn: 'SØKNAD_MOTTATT', timestamp: '2026-12-01', progresjon: 'fullført' }],
//           }}
//         />
//       </NextIntlClientProvider>
//     );
//     expect(screen.getByText('1. desember 2026')).toHaveAttribute('datetime', '2026-12-01');
//     expect(screen.getByRole('button')).toHaveAccessibleDescription('1. desember 2026');
//     expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
//   });
//
//   it('har ingen automatiske tilgjengelighetsfeil', async () => {
//     const { container } = render(<Tidslinje behandling={behandling} />);
//     expect(await axe(container)).toHaveNoViolations();
//   });
//
//   it('velger riktig hendelseskomponent for alle fem hendelser', async () => {
//     const user = userEvent.setup();
//     render(
//       <Tidslinje
//         behandling={{
//           ...behandling,
//           hendelser: hendelseSteg.map(({ navn }) => ({ navn, timestamp: '2026-01-01', progresjon: 'ikke-påbegynt' })),
//         }}
//       />
//     );
//
//     for (const { title, content } of hendelseSteg) {
//       const button = screen.getByRole('button', { name: `${title} Ikke påbegynt` });
//       await user.click(button);
//       expect(screen.getByText(content)).toBeVisible();
//       expect(screen.getAllByRole('button').filter((step) => step.getAttribute('aria-expanded') === 'true')).toEqual([
//         button,
//       ]);
//     }
//   });
//
//   it.each(['fullført', 'aktiv', 'ikke-påbegynt'] as const)(
//     'bevarer ventestatus og standardinnhold for UNDER_BEHANDLING som %s',
//     async (progresjon) => {
//       const user = userEvent.setup();
//       render(
//         <Tidslinje
//           behandling={{
//             ...behandling,
//             hendelser: [{ navn: 'UNDER_BEHANDLING', timestamp: '2026-01-01', progresjon, status: 'VENTER_I_KØ' }],
//           }}
//         />
//       );
//       if (progresjon !== 'aktiv') {
//         await user.click(screen.getByRole('button'));
//       }
//       const content =
//         progresjon === 'ikke-påbegynt'
//           ? 'Dette steget gjelder den siste delen av behandlingen av søknaden din.'
//           : 'Søknaden venter i kø.';
//       expect(screen.getByText(content)).toBeVisible();
//     }
//   );
// });
//
// describe('Hendelsesspesifikke tidslinjesteg', () => {
//   const dateFormatter = new Intl.DateTimeFormat('nb-NO', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//     timeZone: 'Europe/Oslo',
//   });
//
//   it.each(hendelseSteg)(
//     '$navn har egen tittel og innhold og styres av eksplisitte props',
//     async ({ navn, Steg, title, content }) => {
//       const user = userEvent.setup();
//       const onToggle = vi.fn();
//       const hendelse: BehandlingsHendelse = { navn, timestamp: '2026-01-01', progresjon: 'aktiv' };
//       const props = { hendelse, open: true, onToggle, dateFormatter };
//       const { rerender } = render(
//         <ol>
//           <Steg {...props} />
//         </ol>
//       );
//       const button = screen.getByRole('button', { name: `${title} Pågående steg` });
//
//       expect(screen.getByText(content)).toBeVisible();
//       expect(button).toHaveAttribute('aria-expanded', 'true');
//       await user.click(button);
//       expect(onToggle).toHaveBeenCalledOnce();
//       expect(button).toHaveAttribute('aria-expanded', 'true');
//
//       rerender(
//         <ol>
//           <Steg {...props} open={false} />
//         </ol>
//       );
//       expect(screen.getByRole('button', { name: `${title} Pågående steg` })).toHaveAttribute('aria-expanded', 'false');
//       expect(screen.getByText(content)).not.toBeVisible();
//     }
//   );
//
//   it.each(hendelseSteg)(
//     '$navn eier innholdet også når steget fullføres uten ventestatus',
//     ({ navn, Steg, title, content }) => {
//       const hendelse: BehandlingsHendelse = { navn, timestamp: '2026-01-01', progresjon: 'aktiv' };
//       const props = { hendelse, open: true, onToggle: vi.fn(), dateFormatter };
//       const { rerender } = render(
//         <ol>
//           <Steg {...props} />
//         </ol>
//       );
//
//       expect(screen.getByText(content)).toBeVisible();
//
//       rerender(
//         <ol>
//           <Steg {...props} hendelse={{ ...hendelse, progresjon: 'fullført' }} />
//         </ol>
//       );
//       const completedTitle = navn === 'ALDER_LOVVALG_MEDLEMSKAP' ? 'Vi har sjekket søknaden din' : title;
//       expect(screen.getByRole('button', { name: `${completedTitle} Fullført steg` })).toHaveAccessibleDescription(
//         '1. januar 2026'
//       );
//       expect(screen.getByText(content)).toBeVisible();
//       expect(screen.getByRole('listitem')).toHaveAttribute('data-progresjon', 'fullført');
//     }
//   );
//
//   it('lar fellessteget vise children uten eget hendelsesinnhold', () => {
//     const props = {
//       hendelse: behandling.hendelser[0],
//       open: true,
//       onToggle: vi.fn(),
//       dateFormatter,
//       title: 'Eget steg',
//     };
//     const { rerender } = render(
//       <ol>
//         <TidslinjeSteg {...props}>
//           <p>Innhold fra hendelseskomponenten</p>
//         </TidslinjeSteg>
//       </ol>
//     );
//     expect(screen.getByText('Innhold fra hendelseskomponenten')).toBeVisible();
//     expect(screen.queryByText(hendelseSteg[0].content)).not.toBeInTheDocument();
//
//     rerender(
//       <ol>
//         <TidslinjeSteg {...props}>{null}</TidslinjeSteg>
//       </ol>
//     );
//     const button = screen.getByRole('button', { name: 'Eget steg Fullført steg' });
//     expect(document.getElementById(button.getAttribute('aria-controls') ?? '')).toBeEmptyDOMElement();
//   });
// });
