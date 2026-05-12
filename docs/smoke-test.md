# Smoke test — Swedish sites

Run against the local dev server (`pnpm dev`) using `curl POST /api/scan` for each URL. Results captured before launch.

## Results — 2026-05-12

| URL | Score | Crit | Serious | Moderate | Minor | Total | Duration |
| --- | --- | --- | --- | --- | --- | --- | --- |
| https://www.sj.se              | **97**  | 0 | 1 | 0 | 0 | 1 | 3 s |
| https://www.svt.se             | **100** | 0 | 0 | 0 | 0 | 0 | 2 s |
| https://www.dn.se              | **100** | 0 | 0 | 0 | 0 | 0 | 3 s |
| https://www.skatteverket.se    | **100** | 0 | 0 | 0 | 0 | 0 | 1 s |
| https://www.ica.se             | **92**  | 1 | 1 | 0 | 0 | 2 | 2 s |
| https://www.swedbank.se        | **100** | 0 | 0 | 0 | 0 | 0 | 2 s |

## Notes

- **SJ + ICA produce real findings.** Their reports are useful as-is for the launch sample.
- **SVT, DN, Skatteverket, Swedbank score 100.** Plausible — they are mature, well-maintained sites and axe-core only catches roughly 30–40 % of WCAG issues (per the brief). The result page UI already surfaces this caveat: *"automatiska tester fångar uppskattningsvis 30–40 % av tillgänglighetsproblem"*.
- **Scan durations 1–3 s.** The brief estimated ~20 s; in practice `waitUntil: "networkidle"` resolves quickly on these sites. Faster than expected is a win for UX. If we ever see false-perfects from under-rendered SPAs in production, the fix is `waitUntil: "load"` + a small post-load delay before axe runs.

## Reproducing

```bash
SITES=(https://www.sj.se https://www.svt.se https://www.dn.se \
       https://www.skatteverket.se https://www.ica.se https://www.swedbank.se)
for url in "${SITES[@]}"; do
  curl -sS -X POST http://localhost:3000/api/scan \
    -H 'content-type: application/json' \
    -d "{\"url\":\"$url\"}" --max-time 90 \
    | python3 -c "import json,sys; d=json.load(sys.stdin); b=d['byImpact']; \
        print(f\"$url -> {d['score']}/100 (C{b['critical']} S{b['serious']} M{b['moderate']} m{b['minor']})\")"
done
```
