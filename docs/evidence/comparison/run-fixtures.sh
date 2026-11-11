#!/usr/bin/env bash
# Usage: run-fixtures.sh <fixtureDir> <spg-cli.mjs> <skills-ref-python> <vat-install-dir>
# Prints TSV: case, label, SkillPath Guard rules, skills-ref errors, vat issue codes.
fx=$1; spg=$2; py=$3; vatdir=$4; cd "$fx" || exit 2
for c in */; do c=${c%/}; lab=$(cut -f1 "$c/LABEL")
 s=$(node "$spg" scan "$c" --format json 2>/dev/null | node -e 'const r=JSON.parse(require("fs").readFileSync(0));console.log([...new Set(r.findings.map(f=>f.rule))].join(",")||"-")')
 r=$("$py" -I -c 'import sys;from skills_ref import validate;from pathlib import Path;e=validate(Path(sys.argv[1]));print(("ERR:"+"|".join(x.split(":")[0][:40] for x in e)) if e else "-")' "$c/$c")
 v=$(cd "$vatdir" && npx vat audit "$fx/$c" 2>&1 | grep -oE "^ +code: [A-Z_]+" | sed 's/ *code: //' | sort -u | tr '\n' ',' ); v=${v%,}
 printf "%s\t%s\t%s\t%s\t%s\n" "$c" "$lab" "$s" "$r" "${v:--}"
done
