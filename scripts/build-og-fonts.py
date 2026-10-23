"""Build the static Inter faces that app/api/og renders share cards with."""

# Satori reads TrueType but not the variable WOFF2 the pages load, so this pins
# each instance's axes and saves plain TTF. It also drops GPOS: Satori places
# words by their unkerned width but draws them kerned, so every kerned word
# ("Teaching", "AWAY", "7,") was followed by a visibly wider gap. Without
# kerning the drawn text matches the layout.
#
# Run from the repository root: python scripts/build-og-fonts.py
# Needs fontTools with brotli (pip install fonttools brotli).

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# The Thorbis Latin Inter face declared in app/globals.css.
SOURCE = "public/fonts/UcCo3FwrK3iLTcviYwY.woff2"
INSTANCES = {
    "assets/og/inter-og-regular.ttf": {"wght": 400, "opsz": 14},
    "assets/og/inter-og-medium.ttf": {"wght": 500, "opsz": 32},
}

for path, axes in INSTANCES.items():
    font = instantiateVariableFont(TTFont(SOURCE, recalcTimestamp=False), axes, updateFontNames=False)
    font.flavor = None
    del font["GPOS"]
    font.save(path)
    print(path)
