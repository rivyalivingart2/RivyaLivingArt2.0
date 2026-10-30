# Current continuation — 26 October 2026

Read [the Gemini/Antigravity handoff checkpoint](ANTIGRAVITY-HANDOFF-CHECKPOINT.md), [sanitized verification](antigravity-handoff-verification.json), [complete continuation prompt](https://github.com/rivyalivingart2/RivyaLivingArt2.0/blob/7becabb7b6ee9d98f8786435a6e766e2ed33aaa9/docs/google-workspace-2026-10-24/CONTINUE-IN-GEMINI-ANTIGRAVITY.md) and [local/offline runbook](LOCAL-OFFLINE-RUNBOOK.md) first. Continue the existing `codex/google-cloud-acceptance` branch and open PR #67; do not reset to main or provision another sandbox. Fresh connected Drive/Sheets reads succeeded with zero writes. The new portable populated-state audit is locally verified; its full live run requires the original private registry, reviewed baseline and secure runtime OAuth binding. Earlier real writer/protection/deployment evidence remains dated; eight acceptance groups and phases 3–11 remain open. Source PR publication is authorized; a main merge can trigger Vercel production and retains the explicit later-release boundary. The existing production provider stays authoritative.

---

# Cloud Google setup and acceptance

**Current state:** the private folders, four protected workbooks and one version-1 signed writer deployment are installed on Google. Real signed writer, Drive JSON, durable job and private publication-pointer checks have run successfully with non-product probes. Read [SANDBOX-CHECKPOINT.md](SANDBOX-CHECKPOINT.md) and [sandbox-verification.json](sandbox-verification.json) for exact evidence and remaining gaps. The owner requires the environment to stay unpublished. Reuse the existing deployment and registry; do not repeat initial provisioning.

This continuation starts at the verified PR #66 main checkpoint `019f4c1bac2c03dfeab00a1ed1fb46dc20c29d30`, on `codex/google-cloud-acceptance`. The owner authorized the pending isolated Google setup and selected the owning account in chat. That identity is recorded in the ignored private registry, not in this public document. Remaining choices default to private, owner-only resources and owner-executed Apps Script. The current application provider remains authoritative.

The existing Phase 2 implementation is retained. These tools prepare structural installation and inspect an actual installation; they do not replace the writer, create business data, switch application persistence, or certify the complete real-provider acceptance matrix. Read [the isolated target plan](ISOLATED-TARGET-PLAN.md) and [service placement](SERVICE-PLACEMENT.md) alongside this guide.

## Current cloud prerequisites

The cloud machine has checksum-verified Node 22.23.4, npm 10.9.2 and a clean lockfile installation. Source `/workspace/rivya-cloud/env.sh` before commands in `/workspace/RivyaLivingArt2.0`. The saved environment install script reproduces those dependencies; live processes must restart after a new task or publication.

The environment draft declares these required Google destinations: `www.googleapis.com`, `sheets.googleapis.com`, `script.googleapis.com`, `script.google.com`, `script.googleusercontent.com`, and `oauth2.googleapis.com`. Existing package-manager presets are retained. The initial runtime returned a proxy CONNECT denial; the resumed run subsequently verified live Google API access after the owner saved settings. A saved draft alone is not evidence of runtime access. Keep the environment unpublished under the current owner instruction.

No Google connector was available. The owner subsequently supplied a working OAuth proxy binding through secure environment settings. The draft declares `RIVYA_GOOGLE_ACCESS_TOKEN` for the three management API hosts and `RIVYA_GOOGLE_REGISTRY_PATH` for the private registry path. Do not place credentials in chat, command arguments, the registry, Git, or a business workbook. Verify live account access on resumption; a saved binding may expire and its presence alone is not access verification. The owner desktop can refresh the short-lived token privately if needed.

The owner-approved setup scopes are `drive.file`, `drive.metadata.readonly`, `spreadsheets`, `script.projects`, and `script.deployments`, under Google's `https://www.googleapis.com/auth/` prefix. The owner enabled those APIs and Apps Script account API access; the OAuth app remains Testing with the intended owner as its test user. Do not expand scopes or interpret sandbox credentials as permission to mutate production.

The writer signing key is a different credential: `createHmac` consumes its real bytes in the server process. A network-proxy placeholder cannot perform local signing. The owner approved a temporary sandbox-only 0600 runtime key file in a 0700 private directory and RSA-OAEP/SHA-256 encrypted transfer into owner-browser memory. Matching `GW_KEYS_JSON` and exact four-resource `GW_RESOURCES_JSON` properties were saved privately; successful signed behavior verifies their interoperability. The ignored `runtime-secrets.json` records the file path, never its value. Use the 64 hexadecimal characters as UTF-8 key bytes, without decoding them. No ordinary environment variable or source file stores the key. This temporary arrangement is not production secret management.

## Private registry and structural plan

The actual observed registry is stored at `test-results/google-workspace-cloud/registry.json`, mode `0600`, ignored by Git. It contains the installed resource/tab IDs and the single browser-created deployment. Preserve it and its checkpoint journals. Never replace it with a scaffold or emulator/guessed identifiers. If private artifacts are absent in a later environment, that is a real resumption dependency; do not recreate business data or silently provision replacements.

For a fresh environment only, create a scaffold without overwriting an existing file:

```sh
node --import tsx tools/google-workspace/isolated-setup.ts prepare \
  --scaffold --output test-results/google-workspace-cloud/registry.json
```

The optional `--owner-email` argument records the actual selected account as owner, runtime principal and execution identity. Those metadata fields are not credentials. Keep IDs and identities in the private registry and review the real resource ownership independently.

After actual resources are identified, validate metadata and prepare private structural payloads:

```sh
node --import tsx tools/google-workspace/isolated-setup.ts check \
  --registry test-results/google-workspace-cloud/registry.json
node --import tsx tools/google-workspace/isolated-setup.ts prepare \
  --registry test-results/google-workspace-cloud/registry.json \
  --output test-results/google-workspace-cloud/structural-plan.json
```

The plan uses exported record/ledger/audit/history headers, literal string cells, the canonical ready control marker and whole-tab protection. Each initial tab has exactly 100 rows and 12 columns. It includes zero business rows and performs zero Google writes. A valid metadata shape is not proof that the resources exist or belong to the intended account.

**Never apply initial headers/control writes to an existing initialized or populated target.** Inspect the actual empty grids first. Never reset an inflight/committed control marker to make a readiness check pass. The initial readiness check is intentionally unsuitable for certifying a populated sandbox; later acceptance must retain mutation IDs and inspect real receipts/history.

## Installation reference — already completed for this sandbox

Do not rerun these creation/initialization steps against the current sandbox. Its non-product probes and committed control markers are retained evidence. No triggers or schedulers were installed. The browser completed the approved deployment consent; API reads verified version 1, exact source/manifest and owner execution with `ANYONE_ANONYMOUS` endpoint access. Drive/Sheets/project sharing remains owner-only.

1. Confirm the authenticated Google account. Check for already-created resources with the exact sandbox names before creating duplicates. Do not inspect or reuse archived catalogue rows, production workbooks, or supplied media folders as canonical targets.
2. Create or identify the four separate sandbox workbooks and the private sandbox root/eight children specified in the target plan. Keep workbooks under the sandbox root. Review complete ownership and sharing; the current default grants no additional users, groups, domains or public links.
3. Record observed file and tab IDs privately. Verify exact empty grids, initialize only structural cells and protect whole canonical tabs. Preserve any pre-existing data or uncertainty marker; an unexpected target stops initialization.
4. Install the exact version-controlled `Writer.gs` with the baseline manifest plus the explicit isolated webapp configuration: `executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS`. The HTTP endpoint is reachable by the server without Google browser cookies; the existing HMAC protocol authenticates requests. Sheets and Drive files remain private. Keep the baseline Sheets scope and advanced Sheets v4 service; install no scheduler or trigger.
5. Configure exact private `GW_RESOURCES_JSON` and matching `GW_KEYS_JSON` Script Properties. Register the actual immutable script version, deployment ID/URL and key identifier. A source file, deployment URL or verified management response does not prove that private properties or the executing identity are correct.
6. Run the read-only verifier below. Resolve every blocked management check without broadening sharing or resetting canonical state.
7. Execute each separate real-provider scenario in the target plan, retaining raw evidence privately. Only then advance the phase gates for migration rehearsal, reconciliation and backend integration. No current application feature flag or provider setting changes as a consequence of this guide.

## Read-only management verification

The complete **initial empty-state** verifier passed all 36 checks before probes. Its private receipt is `management-before-probes.json`. This verifier deliberately requires initial empty rows/ready control and is now unsuitable as a post-probe pass/fail gate. Use the final audit and receipts named in the current checkpoint for the populated sandbox. Never reset cells to make the initial verifier pass.

```sh
source /workspace/rivya-cloud/env.sh
export RIVYA_GOOGLE_REGISTRY_PATH="$PWD/test-results/google-workspace-cloud/registry.json"
node --use-env-proxy --import tsx tools/google-workspace/verify-isolated.ts
```

Use the configured proxy route; do not bypass egress restrictions. The token is read from secure process configuration, never from command arguments. The verifier uses bounded GET requests to the three fixed Google API hosts and produces sanitized check results without token values, account addresses, resource IDs or response bodies. It checks the account, ownership/sharing, registered resource hierarchy, exact initial grids/literal cells/protections, deployment policy and deployed source/manifest. Failed target identity or access checks prevent dependent content reads.

A successful result covers management observations only. Signed read/write/reload, concurrent revisions, interrupted writes, actual editor/formula rejection, Drive reserved-ID creation and exact-byte retry, independent job recovery, publication-pointer behavior, execution identity and measured authorization/quota/latency remain separate real-provider acceptance. Omitted or blocked scenarios are not passes.

## Preservation and next gates

Keep approved public design, Studio login/security, products, URLs, existing content, relationships and original/selected media unchanged. No products or archived imports, reseeding, request-table repair, deleted-database recovery, Google Photos work or image regeneration is part of this setup.

The Windows private evidence and loopback database are intentionally absent. Migration also requires a fresh owner-controlled source export/access location; historical synthetic row totals are not input data. Existing storage remains authoritative until real-provider acceptance, reconciliation and separately authorized production cutover. This continuation does not release a new application version or claim that phases 3–11 are complete.
