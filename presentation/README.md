# Team Wels - IT Projekt Präsentation

Diese Präsentation wurde mit [Reveal.js](https://revealjs.com/) erstellt.

## Installation

1. Navigieren Sie zum Präsentationsordner:
```bash
cd presentation
```

2. Installieren Sie die Abhängigkeiten:
```bash
npm install
```

## Verwendung

### Option 1: HTML-Präsentation (empfohlen)

Die Hauptpräsentation befindet sich in `index.html`.

Um die Präsentation lokal anzuzeigen:

```bash
npm run serve
```

Dann öffnen Sie Ihren Browser und navigieren Sie zu `http://localhost:8080`

### Option 2: Markdown-Präsentation

Sie können auch die Markdown-Version verwenden (`slides.md`):

```bash
npm start
```

Dies startet einen lokalen Server mit Live-Reload-Funktionalität.

## Struktur

- `index.html` - Haupt-HTML-Präsentationsdatei
- `slides.md` - Alternative Markdown-Version (optional)
- `package.json` - Node.js Abhängigkeiten
- `node_modules/` - Installierte Pakete (nach `npm install`)

## Präsentation bearbeiten

### HTML-Version bearbeiten

Öffnen Sie `index.html` und bearbeiten Sie die Folien innerhalb der `<section>` Tags:

```html
<section>
    <h2>Ihr Titel</h2>
    <p>Ihr Inhalt</p>
</section>
```

### Markdown-Version bearbeiten

Öffnen Sie `slides.md` und verwenden Sie Markdown-Syntax:

```markdown
# Folientitel

Ihr Inhalt hier

---

# Nächste Folie
```

## Tastenkombinationen

- **Pfeiltasten**: Navigation zwischen Folien
- **ESC** oder **O**: Übersicht aller Folien
- **F**: Vollbildmodus
- **S**: Sprechernotizen anzeigen
- **B** oder **.**: Bildschirm schwärzen
- **?**: Hilfe anzeigen

## Themes

Reveal.js bietet verschiedene integrierte Themes:
- black (Standard)
- white
- league
- beige
- sky
- night
- serif
- simple
- solarized

Um das Theme zu ändern, bearbeiten Sie die entsprechende Zeile in `index.html`:

```html
<link rel="stylesheet" href="node_modules/reveal.js/dist/theme/black.css">
```

Ersetzen Sie `black.css` mit einem anderen Theme-Namen.

## Weitere Informationen

- [Reveal.js Dokumentation](https://revealjs.com/)
- [Reveal.js GitHub Repository](https://github.com/hakimel/reveal.js)
- [Reveal-md Dokumentation](https://github.com/webpro/reveal-md)

## Team

- @jakobpeneder
- @simondokter
- @NFFabio
