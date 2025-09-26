# Innsynsløsning for AAP

Ny innsynsløsning for AAP.

# Komme i gang

Appen kan kjøres lokalt med å kjøre følgende kommandoer
`yarn` - installere avhengigheter
`yarn dev` - starte appen

Husk å sette `.env.local`

Appen kjører på port 3000 som default:
http://localhost:3000/aap/mine-aap/nb/

## Bygge app lokalt

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NPM_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github(settings -> developer settings). Husk read:packages rettighet og enable sso når du oppdaterer/lager PAT.

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #ytelse-aap-værsågod.
