# Verzeichnis erstellen
New-Item -ItemType Directory -Force -Path "public" | Out-Null

# Alle .puml-Dateien in den Ordner kopieren
Copy-Item -Path "*.puml" -Destination "public" -Force

# In das Verzeichnis wechseln
Push-Location "public"

# Alte .png und .svg löschen
Remove-Item -Path "*.png", "*.svg" -Force -ErrorAction SilentlyContinue

# Aktuelles Verzeichnis ausgeben
Write-Host "PWD is $(Get-Location)"

# PlantUML via Docker ausführen und SVG erzeugen
Get-Content "state.puml" | docker run --rm -i --entrypoint java ghcr.io/plantuml/plantuml -jar "/opt/plantuml.jar" -tsvg -p | Set-Content "state.svg"

# Aktuelles Verzeichnis ausgeben und Inhalt listen
Get-Location
Get-ChildItem -Force

# Optional: PDF generieren (auskommentiert)
# Get-Content "state.puml" | docker run --rm -i --entrypoint java ghcr.io/plantuml/plantuml -jar "/opt/plantuml.jar" -tpdf -p | Set-Content "state.pdf"

# Sonderzeichen-Dateien und .puml löschen
Remove-Item -Path '?' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "*.puml" -Force -ErrorAction SilentlyContinue

# Zurück ins ursprüngliche Verzeichnis
Pop-Location


