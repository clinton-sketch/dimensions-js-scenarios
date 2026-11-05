"""Turn a scenario .js file into a ready-to-paste Dimensions routing line.

Usage:  python make_banner.py R33_Q36d_disable_after_three.js Q36d
Prints: Q36d.Banners.AddNew("R33_Q36d_disable_after_three", "<script>...</script>")

Comments are stripped, the code is put on one line and every " is doubled, as an
.mrs string needs. Pass IOM as the target for a survey-wide banner.
"""
import pathlib
import re
import sys


def to_banner(js_path, target):
    src = pathlib.Path(js_path).read_text(encoding="utf-8")
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)                    # block comments
    src = re.sub(r"(?m)^\s*//.*$", "", src)                            # whole-line comments
    src = re.sub(r"(?m)(?<![:'\"\\])\s+//[^'\"\n]*$", "", src)          # trailing comments
    one_line = " ".join(line.strip() for line in src.splitlines() if line.strip())
    body = ("<script>" + one_line + "</script>").replace('"', '""')
    name = pathlib.Path(js_path).stem
    return f'{target}.Banners.AddNew("{name}", "{body}")'


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    print(to_banner(sys.argv[1], sys.argv[2]))
