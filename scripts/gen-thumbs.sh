#!/usr/bin/env bash
# Generate thumbnails from public/photos/ into public/photos-thumb/
# Usage: bash scripts/gen-thumbs.sh [width]
# Requires: ImageMagick — install with: brew install imagemagick

set -e

WIDTH=${1:-400}
SRC="public/photos"
DEST="public/photos-thumb"

if ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

find "$SRC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r img; do
  rel="${img#"$SRC"/}"
  dest_file="$DEST/$rel"
  dest_dir="$(dirname "$dest_file")"
  mkdir -p "$dest_dir"
  if [ ! -f "$dest_file" ]; then
    echo "→ $dest_file"
    convert "$img" -resize "${WIDTH}>" "$dest_file"
  fi
done

echo "Done."
