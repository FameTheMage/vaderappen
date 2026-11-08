# Instruktioner för agenter (Väderappen "Solglimt")

## Standardarbetssätt (gäller alla uppgifter)
1. **Intervjua först.** Om information saknas, eller om du ser möjliga förbättringar, ställ frågor till mig innan du går vidare.
2. **Gör en plan.** Skriv en plan som visar vad som ska göras och visa den för mig.
3. **Ingen kod före granskning.** Skriv eller ändra ingen kod förrän jag har granskat och godkänt planen.

**Undantag:** Mindre, små ändringar, till exempel stavfel eller en enstaka ordändring, kan göras direkt utan intervju och plan. Berätta efteråt vad du ändrade.

## Språk
- Svara och skriv kommentarer, commit-meddelanden och dokumentation på svenska.

## Köra projektet
- Starta utvecklingsservern med `npm run dev` (Vite, port 5173).
- Förhandsvisning i Claude använder `.claude/launch.json` (konfigurationen `dev`), som kör `npm run dev -- --port 5173 --strictPort`.
- Om porten är upptagen: stoppa den gamla servern först. Byt inte port.
- Bygg för publicering med `npm run build`. Resultatet hamnar i `dist/`.
- Berätta alltid vad du kör och varför, så att jag ser vad som händer.

## Arbetssätt med git
- Arbeta aldrig direkt på `main`. Använd en egen branch (just nu `nyLayout`).
- Committa och pusha bara när jag ber om det.
- Flödet för nya funktioner (branch, pull request, merge, publicering) står i `NYFUNKTION.md`.
- Publicering sker automatiskt till GitHub Pages när `main` ändras, se `PUBLICERA.md`.

## Kodstruktur
- React 18 + Vite. All kod ligger i `src/`.
  - `App.jsx` är gränssnittet.
  - `styles.css` är all styling, med teman via `data-theme` (`dark`, `happy`, `light`, `system`).
  - `i18n.js` har texter på svenska och engelska. Nya texter läggs till på båda språken.
  - `api.js` hämtar väder och platser.
- Standardtema är `dark`.

## Design
- Modern, futuristisk glasdesign: mörk bakgrund, neonaccenter, frostade paneler.
- Behåll tillgängligheten: tydlig fokusmarkering, minst 44 px stora knappar, SVG-ikoner (inga emojis som ikoner) och respekt för reducerad rörelse.
- Kontrollera ändringar i förhandsvisningen, helst både i skrivbords- och mobilbredd, innan du säger att de är klara.
