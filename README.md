# Team-Wels-ITPProjekt

<!-- Logo -->
<div align="center">
<svg width="116" height="87" viewBox="0 0 116 87" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_198_141)">
<path d="M81.156 51.3732L82 48.6197L68.3331 4L60.9109 28.0506L59 34.2871L72.6954 79L81.156 51.3732Z" fill="#1B98E0"/>
<path d="M87.191 29L95 3L90.5316 6.97761L83.7526 13.0105C83.0996 13.5911 82.8441 14.4993 83.0949 15.3363L87.191 29Z" fill="#1B98E0"/>
<path d="M67 2.56247C66.6129 2.20976 66.1054 2 65.5598 2H50.7643C50.2187 2 49.7112 2.20821 49.3241 2.56091V2.56402H49.321C49.033 2.82816 48.8105 3.17154 48.6931 3.56931L46.7987 9.98018L34.7983 50.6548L26 80.4764C26.381 80.8058 26.8718 81 27.3976 81H42.193C42.7219 81 43.2141 80.8042 43.5967 80.4717C43.8603 80.2433 44.0707 79.9497 44.2033 79.6094L58.1605 32.3017L67 2.56247Z" fill="#1B98E0"/>
<path d="M111.88 10.179C111.687 9.61667 111.269 9.13626 110.69 8.88293L103.994 5.94331L97.705 3.18134C97.248 2.98053 96.7478 2.95118 96.2847 3.07012L87.7229 31.5039L81.9122 50.8315L73 80.4794C73.3859 80.8054 73.8815 81 74.4141 81H89.401C89.9352 81 90.4354 80.8038 90.8228 80.4748C91.0899 80.2462 91.303 79.9542 91.4373 79.6159L107.706 25.4995L108.041 24.3858L111.908 11.5229C112.044 11.0687 112.025 10.6022 111.881 10.182" fill="#1B98E0"/>
<path d="M28.0321 68.3304L34 48.6914L20.4325 4.04312C20.176 3.2007 19.2327 2.7702 18.4192 3.12482L4.88299 9.02486C4.19938 9.32219 3.8474 10.0794 4.06328 10.7871L24.7907 79L28.0336 68.3304H28.0321Z" fill="#1B98E0"/>
</g>
<defs>
<filter id="filter0_d_198_141" x="0" y="0" width="116" height="87" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_198_141"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_198_141" result="shape"/>
</filter>
</defs>
</svg>
</div>

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
