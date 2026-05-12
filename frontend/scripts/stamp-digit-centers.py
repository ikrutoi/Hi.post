"""Print bbox centers for each digit path in sprite_digits.svg (for stamp overlay layout)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    from svgpathtools import parse_path
except ImportError:
    print("pip install svgpathtools", file=sys.stderr)
    raise

ROOT = Path(__file__).resolve().parents[1]
SPRITE = ROOT / "src/features/envelope/assets/sprite_digits.svg"


def main() -> None:
    text = SPRITE.read_text(encoding="utf-8")
    for d in "0123456789":
        m = re.search(
            rf'<path id="digit-{d}" d="([^"]+)" class="fil0"/>',
            text,
        )
        if not m:
            raise SystemExit(f"missing digit {d}")
        d_attr = m.group(1)
        bbox = parse_path(d_attr).bbox()
        xmin, xmax, ymin, ymax = bbox
        cx = (xmin + xmax) / 2
        cy = (ymin + ymax) / 2
        print(f"{d}: cx={cx:.1f} cy={cy:.1f}  w={xmax - xmin:.1f} h={ymax - ymin:.1f}")


if __name__ == "__main__":
    main()
