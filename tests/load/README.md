# Lasttests (k6)

Profile, Lastmixe und Thresholds:
[docs/testing/05-quality-gates-performance.md §3](../../docs/testing/05-quality-gates-performance.md).

| Datei | Profil |
|---|---|
| `smoke.js` | 20 VUs / 5 min — Regressions-Smoke (nightly) |
| `load.js` (folgt M1) | 500 Sessions / 30 min — NFR-001/002/003/006-Nachweis |
| `stress.js`, `soak.js` (folgen) | Sättigung / 4-h-Dauerlast |

Ausführung (k6 installiert oder via Docker):

```bash
k6 run tests/load/smoke.js -e BASE_URL=https://staging.example.org -e API_URL=https://staging.example.org
```
