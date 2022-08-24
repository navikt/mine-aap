# Innsynsløsning for AAP

Ny innsynsløsning for AAP.

# Komme i gang

Appen kan kjøres lokalt med å kjøre følgende kommandoer

`yarn` - installere avhengigheter
`yarn dev` - starte appen

Appen kjører på port 3000 som default

## Bygge app lokalt

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `npm install` lokalt må du logge inn mot Github package registry:

- Lag/forny access token med repo og read:packages rettigheter i github ( under developer settings). husk enable sso
- Login på npm med `npm login --scope=@navikt --registry=https://npm.pkg.github.com` og benytt github brukernavn, epost og tokenet du nettopp genererte

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-aap-innbygger.
