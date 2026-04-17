# Kleines Ticketsystem (MVP)

Ein minimales Ticketsystem auf Basis von **Node.js + Express + EJS** mit JSON-Persistenz.

## MVP-Features

- Ticket erstellen (Titel, Beschreibung, Priorität)
- Ticketliste anzeigen
- Tickets nach Status filtern (`open`, `in_progress`, `done`)
- Ticketdetails anzeigen
- Ticketstatus ändern

## Voraussetzungen

- Node.js 20+ (oder 18+ mit `--watch`-Support)

## Installation

```bash
npm install
```

## Starten

```bash
npm start
```

Anschließend im Browser öffnen: `http://localhost:3000`

## Entwicklung (optional)

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Projektstruktur

- `server.js` – Startpunkt
- `src/app.js` – Express-Routen und App-Setup
- `src/ticketStore.js` – Ticketlogik + Dateipersistenz
- `views/` – EJS-Templates
- `public/` – Styles
- `data/tickets.json` – persistente Ticketdaten
