<<<<<<< Updated upstream
# Team-Wels-ITPProjekt

<!-- Logo -->
<p align="center">
  <img src="logo.svg" alt="Team-Wels-ITPProjekt Logo" width="200"/>
</p>

## Kurzbeschreibung

Willkommen zum **Lob- und Beschwerdesystem** für die Stadt Wels! Dieses Projekt wurde im Rahmen des ITP-Kurses entwickelt und ermöglicht Bürgern, Feedback, Lob und Beschwerden an die Stadtverwaltung zu übermitteln. Das System bietet eine moderne Web-Oberfläche mit dem Slogan: *„Deine Stadt. Deine Meinung."*

## Kernpunkte & Features

- **Feedback-System**: Bürger können Lob, Beschwerden und Anliegen an die Stadt senden
- **Kategorisierung**: Feedback kann nach Themen und Kategorien geordnet werden
- **Statusverfolgung**: Feedback durchläuft verschiedene Status (z.B. offen, in Bearbeitung, erledigt)
- **Benutzerprofile**: Angemeldete Nutzer können ihre eingereichten Anliegen verfolgen
- **Modularer Aufbau**:
  - `WebApp/frontend/` — TypeScript-basiertes Frontend
  - `WebApp/backend/` — Quarkus-basiertes Java-Backend mit PostgreSQL
  - `Projekt-Doku/` — Präsentation (reveal.js) und Projektunterlagen

## Technologie-Stack

| Komponente | Technologie |
|------------|-------------|
| Backend | Quarkus (Java 17), Hibernate ORM mit Panache |
| Datenbank | PostgreSQL 16 |
| Frontend | TypeScript, HTML5, CSS3 |
| Containerisierung | Docker, Docker Compose |
| Präsentation | reveal.js |
| Diagramme | PlantUML |

## Schnellstart

### Voraussetzungen

- Docker & Docker Compose
- Java 17+ (für lokale Backend-Entwicklung)
- Node.js (für Frontend und Präsentation)

### 1. Repository klonen

```bash
git clone https://github.com/thseBene/Team-Wels-ITPProjekt.git
cd Team-Wels-ITPProjekt
```

### 2. Datenbank mit Docker starten

```bash
cd WebApp
docker-compose up -d
```

Die PostgreSQL-Datenbank ist nun unter `localhost:5432` erreichbar:
- Datenbank: `teamwels`
- Benutzer: `teamwels`
- Passwort: `teamwels`

### 3. Backend (Quarkus) starten

```bash
cd WebApp/backend/backend
./mvnw compile quarkus:dev
# oder auf Windows:
# mvnw.cmd compile quarkus:dev
```

Das Backend ist unter [http://localhost:8080](http://localhost:8080) erreichbar.  
Dev UI: [http://localhost:8080/q/dev/](http://localhost:8080/q/dev/)

### 4. Frontend öffnen

Öffne `WebApp/frontend/public/index.html` im Browser.

### 5. Präsentation lokal anzeigen

```bash
cd Projekt-Doku
npx serve .
# oder
npx live-server .
```

## Projektstruktur

```
Team-Wels-ITPProjekt/
├── README.md                    # Diese Datei
├── logo.svg                     # Projekt-Logo
├── WebApp/
│   ├── docker-compose.yml       # PostgreSQL-Datenbank-Setup
│   ├── backend/
│   │   └── backend/             # Quarkus-Backend
│   │       ├── src/main/java/   # Java-Quellcode (Entities, Resources, Services)
│   │       └── pom.xml          # Maven-Konfiguration
│   └── frontend/
│       └── public/              # Frontend (HTML, CSS, TypeScript)
│           ├── index.html       # Startseite
│           └── html/            # Weitere Seiten (Feedback, Profil, etc.)
├── Projekt-Doku/                # Präsentation (reveal.js)
├── Organisatorisches/           # Projektantrag, Pitch
├── plantUML/                    # ERD und andere Diagramme
├── Logo/                        # Logo-Dateien (verschiedene Formate)
├── Farbthema/                   # Design-Farbschema
└── How to work.txt              # Team-Arbeitsanleitung (Git, Scrum, Clockify)
```

## Datenmodell

Das System basiert auf folgenden Hauptentitäten:

- **Benutzer**: Bürger, die Feedback einreichen
- **Feedback**: Lob, Beschwerden oder Anliegen
- **Thema**: Oberkategorie des Feedbacks
- **Kategorie**: Detailkategorie für Feedback
- **Status**: Aktueller Bearbeitungsstand
- **Bild**: Optionale Bildanhänge zum Feedback

Das vollständige ERD befindet sich in `plantUML/ERD.puml`.

## API-Endpunkte

Das Backend stellt REST-Endpunkte für folgende Ressourcen bereit:

- `/feedback` — Feedback erstellen und abrufen
- `/benutzer` — Benutzerverwaltung
- `/notification` — Benachrichtigungen

## Mitwirkende

- Jakob Peneder (@jakobpeneder)
- Simon Dokter (@simondokter)
- Fabio (@NFFabio)
- Weitere Mitwirkende: @thseBene (Repo-Owner)

## Links & Ressourcen

- [Miro-Board (Projektplanung)](https://miro.com/app/board/uXjVJ5z-XVY=/?share_link_id=979235064816)
- [Quarkus](https://quarkus.io/)
- [reveal.js](https://revealjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
=======
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
>>>>>>> Stashed changes
