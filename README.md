# Solglimt – väderappen ☀️

En glad webbapp som visar vädret just nu och de kommande fem dagarna för valfri ort.

## Funktioner

- Sök efter orter (OpenWeatherMap Geocoding) och se aktuellt väder samt femdygnsprognos.
- Spara favoritorter i webbläsaren (localStorage) och byt snabbt mellan dem.
- Svenska och engelska – byt med flaggorna uppe till höger.
- Fyra teman: Glad, Ljus, Mörk och Följ systemet. Valet kommer ihåg.
- Växla mellan °C/m/s och °F/mph.
- Responsiv design för både mobil och dator.

## Kom igång

1. Skaffa en gratis API-nyckel på [openweathermap.org](https://openweathermap.org/api).
2. Kopiera `.env.example` till `.env.local` och fyll i nyckeln:

   ```
   VITE_OPENWEATHER_API_KEY=din_nyckel
   ```

3. Installera och starta:

   ```bash
   npm install
   npm run dev
   ```

`npm run build` skapar en produktionsbygge i `dist/` (Vite `base` är `./`, så det fungerar på GitHub Pages).

> Obs: nyckeln läggs in i webbläsarbygget av Vite och är därför synlig för den som besöker en publicerad sida. Använd en nyckel du är beredd att byta ut.
