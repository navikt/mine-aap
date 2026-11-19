# Innsynsløsning for AAP

Ny innsynsløsning for AAP.

# Opsett

https://aap-sysdoc.ansatt.nav.no/teknisk/frontend

# Komme i gang

Appen kan kjøres lokalt med å kjøre følgende kommandoer
`pn install` - installere avhengigheter
`pn dev:mock` - starte appen med mock
`pn dev` - starte appen mot api lokalt

Husk å sette `.env.local` med verdiene fra `.env.local.template`

Appen kjører på port 3000 som default:
http://localhost:3000/aap/mine-aap/nb/


## Typescript

Appen bruker genererte typer fra aap-innsending. For å oppdatere typene, pull `navikt/aap-innsending` og kjør den opp lokalt med TestApp.kt. Kjør så følgende kommando i dette repoet:

`pn run gentypes:innsending`

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #ytelse-aap-værsågod.
