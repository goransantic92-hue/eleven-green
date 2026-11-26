"""Set ?v=<version> on every local css/ and js/ reference in the root *.html pages.

Use it when you need visitors' browsers to fetch fresh CSS/JS immediately (for example after changing
cache headers). With the current `max-age=0, must-revalidate` headers it is not needed for normal edits.

    python tools/bump-version.py 20261126b
"""
import glob
import os
import re
import sys

if len(sys.argv) != 2:
    sys.exit(__doc__)
version = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pattern = re.compile(r'((?:href|src)=")((?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=[\w.-]+)?(")')
total = 0
for path in sorted(glob.glob(os.path.join(root, '*.html'))):
    text = open(path, encoding='utf8').read()
    new, count = pattern.subn(lambda m: f'{m.group(1)}{m.group(2)}?v={version}{m.group(3)}', text)
    if count:
        open(path, 'w', encoding='utf8').write(new)
    total += count
    print(f'{os.path.basename(path)}: {count}')
print(f'{total} references set to ?v={version}')
