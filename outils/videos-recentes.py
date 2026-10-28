#!/usr/bin/env python3
"""Met à jour videos-recentes.js avec les 3 dernières vidéos de la chaîne YouTube.

Lancé automatiquement par GitHub (.github/workflows/videos-recentes.yml).
Pour le lancer à la main :  python3 outils/videos-recentes.py
"""
import json
import pathlib
import urllib.request
import xml.etree.ElementTree as ET

CHAINE = "UCpjH541nGeRSmlRfy4xvbgQ"  # Maths avec M. LECLERC (@mathsavecm.leclerc)
NOMBRE = 3
SORTIE = pathlib.Path(__file__).resolve().parent.parent / "videos-recentes.js"

NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}

url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + CHAINE
with urllib.request.urlopen(url, timeout=30) as r:
    flux = ET.fromstring(r.read())

videos = [
    {
        "titre": e.findtext("a:title", namespaces=NS).strip(),
        "lien": "https://www.youtube.com/watch?v=" + e.findtext("yt:videoId", namespaces=NS),
        "date": e.findtext("a:published", namespaces=NS)[:10],
    }
    for e in flux.findall("a:entry", NS)[:NOMBRE]
]
if not videos:
    raise SystemExit("Aucune vidéo trouvée dans le flux : fichier laissé tel quel.")

SORTIE.write_text(
    "/* Fichier mis à jour automatiquement (outils/videos-recentes.py) : ne pas le modifier à la main. */\n"
    "const VIDEOS_RECENTES = " + json.dumps(videos, ensure_ascii=False, indent=2) + ";\n",
    encoding="utf-8",
)
print("\n".join(v["date"] + "  " + v["titre"] for v in videos))
