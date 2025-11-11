# Team-Wels-ITPProjekt

<!-- Logo -->
<p align="center">
  <img src="logo.svg" alt="Team-Wels-ITPProjekt Logo" width="200"/>
</p>

## Kurzbeschreibung

Willkommen zum Team-Wels ITP-Projekt. Dieses Repository enthält die Implementierung und Dokumentation unseres Projektteils im Rahmen des ITP-Kurses. Ziel ist es, eine Web-Anwendung mit Backend und Präsentationsmaterial bereitzustellen.

## Kernpunkte & Features

- Modularer Projektaufbau:
  - WebApp/backend: Quarkus-basiertes Java-Backend
  - Projekt-Doku: Präsentation (reveal.js) und Projektunterlagen
- CI/CD & Dev-Setup: Hinweise und Startskripte im jeweiligen Unterordner
- Ziel: Prototyp einer datengetriebenen Webanwendung mit sauberer Dokumentation

## Schnellstart

1. Repository klonen:

```bash
git clone https://github.com/thseBene/Team-Wels-ITPProjekt.git
cd Team-Wels-ITPProjekt
```

2. Backend (Quarkus) lokal starten:

```bash
cd WebApp/backend
./mvnw compile quarkus:dev
# or on Windows
# mvnw.cmd compile quarkus:dev
```

3. Präsentation lokal anzeigen:

```bash
cd Projekt-Doku
npx serve .
# or
npx live-server .
```

## Projektstruktur (Kurz)

- README.md — Diese Datei
- Projekt-Doku/ — Präsentationsmaterial (reveal.js)
- WebApp/backend/ — Quarkus-Backend, Build- und Run-Anleitung

## Mitwirkende

- Jakob Peneder (@jakobpeneder)
- Simon Dokter (@simondokter)
- Fabio (@NFFabio)
- Weitere Mitwirkende: @thseBene (Repo-Owner)

## Links & Ressourcen

- Miro-Board (Projektplanung): https://miro.com/app/board/uXjVJ5z-XVY=/?share_link_id=979235064816
- Quarkus: https://quarkus.io/
- reveal.js: https://revealjs.com/
