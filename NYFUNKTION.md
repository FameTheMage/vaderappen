# Jobba med ny funktion: branch, merge och publicering

Ersätt `DITT-ANVÄNDARNAMN` med ditt GitHub-användarnamn och `min-funktion` med ett kort namn på det du bygger, till exempel `varningar`.

Flödet: **ny branch → ändra och testa → pull request → merge till `main` → automatisk publicering.**

---

## 1. Skapa en ny branch

**Vad och varför:** En branch är en egen kopia av koden där du kan experimentera. `main` är det som är publicerat, och den påverkas inte förrän du själv slår ihop.

**Gör så här** (PowerShell):

```powershell
cd E:\AIKurs\vaderappen
git switch main
git pull
git switch -c min-funktion
```

Arbeta nu som vanligt och testa med `npm run dev`. Spara ändringarna och ladda upp branchen:

```powershell
git add .
git commit -m "Beskriv vad du ändrade"
git push -u origin min-funktion
```

`-u` behövs bara första gången du pushar en ny branch.

**Kontrollera:**
- `git branch` visar alla branches. Den med `*` är den du står på.
- `git status` ska säga `On branch min-funktion`.
- På GitHub: klicka på branch-väljaren (står `main`) i ditt repo. Där ska `min-funktion` finnas.
- Sidan på GitHub Pages ändras **inte** än. Det är rätt.

---

## 2. Merga in i main

**Vad och varför:** En pull request (PR) visar exakt vad som ändrats innan det slås ihop med `main`. Det ger en sista kontroll och sparar historiken.

**Gör så här** (på GitHub):

1. Öppna ditt repo. Klicka på **Compare & pull request** i gula rutan, eller gå till fliken **Pull requests** → **New pull request**.
2. Kontrollera att det står `base: main` ← `compare: min-funktion`.
3. Skriv en kort rubrik och klicka på **Create pull request**.
4. Läs igenom fliken **Files changed**.
5. Klicka på **Merge pull request** → **Confirm merge**.
6. Klicka på **Delete branch** (valfritt, men det håller det prydligt).

**Gör så här** (PowerShell, hämta den nya `main` till datorn och städa):

```powershell
git switch main
git pull
git branch -d min-funktion
```

**Kontrollera:**
- Pull requesten får lila märket **Merged**.
- `git log --oneline` visar din commit överst på `main`.
- Filerna i `main` på GitHub innehåller din ändring.

---

## 3. Publicera på GitHub Pages

**Vad och varför:** Du behöver inte göra något extra. När `main` ändras, alltså när du mergar, bygger och publicerar GitHub Actions automatiskt.

**Gör så här:**

1. Gå till fliken **Actions** i repot direkt efter merge.
2. Vänta tills körningen "Deploy to GitHub Pages" får en grön bock (cirka en minut).
3. Öppna sidan: `https://DITT-ANVÄNDARNAMN.github.io/vaderappen/`

**Kontrollera:**
- Tryck **Ctrl+F5** för att ladda om utan cache, annars kan du se den gamla versionen.
- Testa din nya funktion på den publicerade sidan, gärna även på mobilen.
- Om körningen är röd: klicka på den, öppna det röda steget och läs felet. Rätta, committa och pusha igen, eller kör **Re-run all jobs**.



## Snabbversion

```powershell
git switch main; git pull
git switch -c min-funktion
# ändra och testa med 'npm run dev'
git add .
git commit -m "Beskrivning"
git push -u origin min-funktion
# GitHub: Pull request → Merge
git switch main; git pull
git branch -d min-funktion
```
### Rensa bort branchen efter publicering
git switch main
git pull
git branch -d min-funktion
git push origin --delete min-funktion
git fetch --prune
```

På GitHub: om du inte redan klickade på **Delete branch** efter merge, gör det på den mergade pull requesten. Då behövs inte `git push origin --delete`.


----------- 
Lägga till och skicka till GITHUB

Du behöver inte göra något på GitHub för det här. Du committar direkt på main och pushar, vilket är enklast för en ren dokumentationsfil.

PowerShell:

cd E:\AIKurs\vaderappen
git switch main
git status

git status ska visa NYFUNKTION.md under “Untracked files”. Om det även står andra filer du inte vill ha med, säg till.

git add NYFUNKTION.md
git commit -m "Lägg till guide för nya funktioner och branches"
git push

Kontrollera:

git status ska säga nothing to commit, working tree clean.
Ladda om repot på GitHub. NYFUNKTION.md ska finnas i fillistan.
Fliken Actions startar en ny publicering, eftersom main ändrades. Den blir grön efter cirka en minut. Sidan ser likadan ut, eftersom bara en md-fil lades till.

Vill du öva på branch-flödet i stället? Då skapar du en branch först med git switch -c nyfunktion-guide och följer sedan NYFUNKTION.md från steg 1. För en liten dokumentationsfil är det inte nödvändigt.



Lägg till och få upp ändringarna på GitHub:
git status
git add .
git commit -m "kommentar"
git push
------------------