#!/bin/sh
# Copies the site into a scratch folder with the <html>/<head>/<body> wrapper
# stripped from index.html, which is the form the Claude Artifact tool expects.
# Usage: scripts/build-artifact.sh <output-dir>
set -e
OUT="${1:?output dir}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
rm -rf "$OUT" && mkdir -p "$OUT"
cp -R "$SRC/css" "$SRC/js" "$SRC/images" "$SRC/content.js" "$OUT/"
python3 - "$SRC/index.html" "$OUT/index.html" <<'PY'
import re, sys
s = open(sys.argv[1]).read()
for pat in [r'<!DOCTYPE html>\s*', r'<html[^>]*>\s*', r'<head>\s*', r'<meta charset[^>]*>\s*', r'<meta name="viewport"[^>]*>\s*',
            r'</head>\s*', r'<body>\s*', r'</body>\s*', r'</html>\s*']:
    s = re.sub(pat, '', s, count=1)
open(sys.argv[2], 'w').write(s)
PY
echo "built -> $OUT"
