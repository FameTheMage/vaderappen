# Publicera vaderappen på GitHub och GitHub Pages

Följ stegen i ordning. Varje steg har tre delar:
**Vad och varför**, **Gör så här** och **Kontrollera**.

Ersätt `DITT-ANVÄNDARNAMN` med ditt GitHub-användarnamn och `DIN-E-POST` med den e-post du använder på GitHub.

> **Viktigt om API-nyckeln:** `.env.local` ligger i `.gitignore` och laddas därför aldrig upp. Det är meningen. Eftersom Vite bygger in nyckeln i sidan måste GitHub få nyckeln på ett säkert sätt när sidan byggs. Det gör du med en *Secret* (steg 5). Skriv aldrig in nyckeln i en fil som committas.

---

## Steg 1. Kontrollera att Git finns och ställ in vem du är

**Vad och varför:** Git är verktyget som sparar versioner av din kod och skickar dem till GitHub. Varje version (commit) märks med ditt namn och din e-post.

**Gör så här** (PowerShell, i vilken mapp som helst):

```powershell
git --version
git config --global user.name "Ditt Namn"
git config --global user.email "DIN-E-POST"
```

Om `git --version` inte fungerar installerar du Git från https://git-scm.com/download/win och öppnar sedan PowerShell på nytt.

**Kontrollera:**

```powershell
git config --global --list
```

Du ska se `user.name` och `user.email` i listan.

---

## Steg 2. Skapa ett tomt repository på GitHub

**Vad och varför:** Ett repository (repo) är projektets hemma på GitHub. Det ska vara *tomt*, annars får du konflikter när du laddar upp din lokala kod. Det ska vara *Public*, eftersom GitHub Pages är gratis för publika repon.

**Gör så här** (i webbläsaren):

1. Logga in på https://github.com.
2. Klicka på **+** uppe till höger och välj **New repository**.
3. **Repository name:** `vaderappen`
4. Välj **Public**.
5. Bocka **inte** i *Add a README file*, *Add .gitignore* eller *Choose a license*.
6. Klicka på **Create repository**.

**Kontrollera:** Du kommer till en sida med rubriken "Quick setup" och adressen `https://github.com/DITT-ANVÄNDARNAMN/vaderappen`.

---

## Steg 3. Gör mappen till ett Git-repo och gör din första commit

**Vad och varför:** `git init` gör projektmappen till ett lokalt repo. `git add` väljer vilka filer som ska med. `git commit` sparar en version. Först kontrollerar vi att inget hemligt följer med.

**Gör så här** (PowerShell):

```powershell
cd E:\AIKurs\vaderappen
git init -b main
git add .
git status
```

Läs listan som `git status` visar under "Changes to be committed". Kontrollera att:

- `.env.local` **inte** finns med. Det ska den inte, eftersom `.gitignore` utesluter den.
- `node_modules/` och `dist/` **inte** finns med.
- `.env.example` finns med. Den är tom och därför säker.

**Städa först (valfritt):**

- Filen `.gitignor` (utan "e") är ett skrivfel från början. Den gör ingenting och kan tas bort med `Remove-Item .gitignor`.
- Mappen `.claude/` är bara inställningar för förhandsvisningen i Claude-appen. Du kan hålla den utanför repot genom att lägga raden `.claude` i `.gitignore`.

Gör städningen **före** `git add .`. Har du redan kört `git add .` kör du `git add .` igen efteråt.

Skapa sedan din första commit:

```powershell
git commit -m "Första version av väderappen"
```

**Kontrollera:**

```powershell
git log --oneline
```

Du ska se en rad med texten "Första version av väderappen". Kör `git status` igen. Den ska säga `nothing to commit, working tree clean`.

---

## Steg 4. Koppla till GitHub och ladda upp (push)

**Vad och varför:** `git remote add` talar om var på GitHub koden ska bo. `git push` skickar dina commits dit.

**Gör så här** (PowerShell):

```powershell
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/vaderappen.git
git push -u origin main
```

Första gången öppnas ett fönster där du loggar in på GitHub. Följ anvisningarna där. Du skriver aldrig ditt lösenord i terminalen.

**Kontrollera:**

- Ladda om `https://github.com/DITT-ANVÄNDARNAMN/vaderappen` i webbläsaren. Du ska se dina filer.
- Kontrollera att `.env.local` **inte** finns i fillistan.
- I terminalen: `git remote -v` ska visa adressen två gånger (fetch och push).

---

## Steg 5. Lägg in API-nyckeln som Secret på GitHub

**Vad och varför:** Sidan byggs av GitHub, inte av din dator, och GitHub har därför inte din `.env.local`. En Secret är ett krypterat värde som bara byggprocessen kan läsa. Det är aldrig synligt i koden eller i repot.

**Gör så här** (på GitHub):

1. Öppna ditt repo och klicka på **Settings** (kugghjulet i fliken högst upp).
2. I vänstermenyn: **Secrets and variables** → **Actions**.
3. Klicka på **New repository secret**.
4. **Name:** `VITE_OPENWEATHER_API_KEY` (exakt så, med stora bokstäver)
5. **Secret:** klistra in din OpenWeatherMap-nyckel.
6. Klicka på **Add secret**.

**Kontrollera:** Under *Repository secrets* står `VITE_OPENWEATHER_API_KEY`. Värdet visas aldrig, och det är rätt.

> **Att veta:** Även med en Secret hamnar nyckeln i den färdiga JavaScript-filen på den publicerade sidan, så en nyfiken besökare kan hitta den. Det går inte att undvika i en ren webbapp utan server. Om nyckeln missbrukas kan du skapa en ny på openweathermap.org (under *My API keys*) och uppdatera Secreten.

---

## Steg 6. Slå på GitHub Pages med GitHub Actions

**Vad och varför:** Du ska säga åt GitHub att publicera sidan från en automatisk byggprocess (GitHub Actions) i stället för från en mapp i repot.

**Gör så här** (på GitHub):

1. **Settings** → **Pages** (i vänstermenyn).
2. Under **Build and deployment**, vid **Source**, välj **GitHub Actions**.

**Kontrollera:** Sidan visar nu att källan är GitHub Actions. Det finns ingen sparaknapp, valet sparas direkt.

---

## Steg 7. Skapa arbetsflödet som bygger och publicerar

**Vad och varför:** Arbetsflödet är en receptfil. Varje gång du pushar till `main` installerar GitHub beroenden, kör `npm run build` med din Secret och publicerar innehållet i `dist/`.

**Gör så här** (PowerShell, i projektmappen):

Skapa mappen:

```powershell
New-Item -ItemType Directory -Force .github\workflows
```

Skapa filen `.github\workflows\deploy.yml` (till exempel i VS Code eller Anteckningar) med exakt det här innehållet:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_OPENWEATHER_API_KEY: ${{ secrets.VITE_OPENWEATHER_API_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Indrag i YAML-filer måste vara mellanslag, aldrig tabbar. Filen måste ligga på exakt sökvägen `.github/workflows/deploy.yml`.

Committa och pusha:

```powershell
git add .github
git commit -m "Lägg till publicering till GitHub Pages"
git push
```

**Kontrollera:** Gå till fliken **Actions** i ditt repo. Där startar en körning som heter "Deploy to GitHub Pages". Den får först en gul snurra, sedan en grön bock efter ungefär en minut. Klicka på körningen för att se varje steg.

---

## Steg 8. Öppna och kontrollera den publicerade sidan

**Vad och varför:** Här ser du att allt fungerar på riktigt, utanför din egen dator.

**Gör så här:**

Öppna adressen:

```
https://DITT-ANVÄNDARNAMN.github.io/vaderappen/
```

Adressen visas också i Actions-körningen under jobbet *deploy* och i **Settings → Pages**.

**Kontrollera:**

- Sidan laddas med titeln "Solglimt" och solfavicon.
- Sök efter en ort. Du ska få väder och prognos. Får du ett felmeddelande om nyckeln, se felsökningen nedan.
- Prova språkflaggorna, temavalet och favoriterna.
- Testa på mobilen med samma adress.
- Om du ser en gammal version: tryck **Ctrl+F5** för att ladda om utan cache.

---

## Så publicerar du ändringar framöver

**Vad och varför:** Varje gång du pushar till `main` bygger och publicerar GitHub automatiskt en ny version. Du behöver inte göra något mer.

**Gör så här** (PowerShell):

```powershell
cd E:\AIKurs\vaderappen
git status
git add .
git commit -m "Beskriv vad du ändrade"
git push
```

**Kontrollera:**

- `git status` före commit visar vilka filer som ändrats.
- `git diff` visar exakt vilka rader som ändrats (avsluta med `q`).
- `git log --oneline` visar historiken.
- Fliken **Actions** på GitHub visar bygget. Efter grön bock är ändringen live.

---

## Felsökning

| Problem | Trolig orsak | Åtgärd |
| --- | --- | --- |
| `git push` ber om inloggning och misslyckas | Fel konto eller utgången inloggning | Kör `git push` igen och logga in i fönstret. Kontrollera att adressen i `git remote -v` är rätt. |
| `remote origin already exists` | Du har redan kört `git remote add` | Kör `git remote set-url origin https://github.com/DITT-ANVÄNDARNAMN/vaderappen.git` |
| `rejected ... fetch first` | Repot på GitHub är inte tomt | Skapa repot igen utan README, eller kontakta mig för hjälp med att slå ihop historiken |
| Actions-körningen blir röd vid `npm ci` | `package-lock.json` saknas i repot | Kontrollera med `git ls-files package-lock.json`. Filen ska vara committad. |
| Actions-körningen blir röd vid deploy | Pages-källan är inte satt till GitHub Actions | Gör om steg 6 och kör **Re-run all jobs** i Actions |
| Sidan är vit eller visar 404 | Fel adress eller bygget är inte klart | Kontrollera att adressen slutar med `/vaderappen/` och att Actions är grön |
| Appen säger att nyckeln saknas | Secreten saknas eller har fel namn | Kontrollera att namnet är exakt `VITE_OPENWEATHER_API_KEY`. Kör sedan om bygget (**Re-run all jobs**). |
| Appen säger att nyckeln inte fungerar | Nyckeln är fel inklistrad eller inte aktiverad än | Klistra in den på nytt i Secreten. Nya OpenWeatherMap-nycklar kan ta några timmar att aktiveras. |

---

## Ordlista

- **Repository (repo):** projektmapp med full historik, här på GitHub.
- **Commit:** en sparad version med en kort beskrivning.
- **Push:** skicka dina commits från datorn till GitHub.
- **Branch `main`:** huvudgrenen. Det som ligger här publiceras.
- **GitHub Actions:** GitHubs inbyggda automatisering. Den bygger och publicerar åt dig.
- **Secret:** ett krypterat värde (som en API-nyckel) som bara byggprocessen kan läsa.
