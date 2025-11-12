from __future__ import annotations

import os
from pathlib import Path


REPLACEMENTS = {
    "â‚¬": "€",
    "âœ“": "✓",
    "âœ—": "✗",
    "â†’": "→",
    "âœ•": "✕",
    "â€¢": "•",
    "â€“": "–",
    "â€”": "—",
    "â€¦": "…",
    "â€™": "’",
    "â€˜": "‘",
    "â€œ": "“",
    "â€": "”",
    "â„¢": "™",
    "âš¡": "⚡",
    "â˜ï¸": "☁️",
    "â˜‚ï¸": "☂️",
    "â˜ƒï¸": "☃️",
    "â˜„ï¸": "☄️",
    "â˜…ï¸": "⭐️",
    "â˜†ï¸": "★️",
    "â˜†": "★",
    "â­": "⭐",
    "â„ï¸": "❄️",
    "â¤": "❤",
    "âœ”": "✔",
    "â˜€": "☀",
    "â˜…": "★",
    "â˜†": "★",
    "â˜‚": "☂",
    "â˜ƒ": "☃",
    "â˜„": "☄",
    "â˜": "☁",
    "â˜º": "☺",
    "â˜ ": "☺",
    "âž¡": "➡",
    "â˜‰": "☉",
}

ALLOWED_SUFFIXES = {".ts", ".tsx", ".md", ".json", ".txt", ".html", ".xml"}


def should_process(path: Path) -> bool:
    if any(part.startswith(".git") for part in path.parts):
        return False
    return path.suffix.lower() in ALLOWED_SUFFIXES


def fix_file(path: Path) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    if not any(bad in text for bad in REPLACEMENTS):
        return False

    original = text
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True

    return False


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    updated = []

    for dirpath, _dirnames, filenames in os.walk(root):
        for filename in filenames:
            file_path = Path(dirpath, filename)
            if should_process(file_path) and fix_file(file_path):
                updated.append(str(file_path.relative_to(root)))

    if updated:
        print("Updated", len(updated), "files:")
        for rel in updated:
            print(" -", rel)
    else:
        print("No files required updates.")


if __name__ == "__main__":
    main()

