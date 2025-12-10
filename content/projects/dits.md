---
title: "Dits — Media-First Version Control"
url: "https://dits.byronwade.com"
category: "Hobby"
type: "hobby"
date: 2025-12-09
excerpt: "A Git-style, content-addressed VCS engineered for large media: video, game builds, 3D scenes, RAW photo libraries, and other binary beasts."
---

# Dits — Media-First Version Control (Longform Portfolio Summary)

A Git-style, content-addressed VCS engineered for large media: video, game builds, 3D scenes, RAW photo libraries, and other binary beasts. This document is a website-ready, 1000+ line explainer that blends product value, architecture, safety guarantees, roadmap, and operations—all distilled from the `docs/` corpus.

## How to Use This Summary

- Share as a project profile on a personal site or portfolio.
- Lift sections for talks, one-pagers, or RFP answers.
- Skim top sections for story; dive into appendices for technical depth.
- All statements align with the documented architecture, APIs, and operations playbooks in `docs/`.

## Table of Contents (Quick Jump)

- Elevator Pitch
- The Problem Space
- One-Line Solution
- Who It Serves
- Why It Wins vs. Traditional VCS
- Core Architecture (Two-Layer Model)
- Content Pipeline (FastCDC → BLAKE3 → CAS)
- Manifest and Index Formats
- Data Structures (Chunk, Asset, Commit, Branch, Tag, Lock, Reflog)
- Algorithms (FastCDC, Keyframe Alignment, Bloom Filters, Delta Sync)
- Sync and Transport (QUIC Wire Protocol, Have/Want)
- Virtual Filesystem and Locking
- Storage Layout and Garbage Collection
- Caching Strategy (Client + Server)
- Security and Safety Checklist
- Performance Targets and Benchmarks
- Deployment and Self-Hosting
- Operations and Runbooks
- CLI Usage Cheat Sheet
- Workflows by Persona (Video, Games, 3D, Photo)
- SDKs and API Surface
- Roadmap (9 Phases)
- Business and Compliance Notes
- Migration and CI/CD Guides
- Edge Cases and Failure Modes
- Known Issues and Solutions (Highlights)
- Disaster Recovery and Backup
- Troubleshooting and Quick Fixes
- Team Collaboration Patterns
- Tech Stack at a Glance
- Glossary (Extended)
- FAQ (Condensed)
- Contact and Links

## Elevator Pitch

- Git-like version control built for massive binaries.
- Content-defined chunking so only changed bytes move.
- Format-aware: keeps MP4 atoms intact, aligns to keyframes.
- QUIC delta sync with Bloom-filter-based have/want negotiation.
- Virtual filesystem mounts for on-demand hydration; locks prevent binary conflicts.
- Open core you can self-host; optional cloud (Ditshub) shares the same protocol.

## The Problem Space

- Traditional VCS treats every binary edit as a full-file replacement.
- Cloud drives are ad hoc: duplicate copies, unclear provenance, weak history.
- Rendered video re-encodes rewrite all bytes; small tweaks cost gigabytes.
- Game builds and 3D scenes are non-mergeable; teams serialize work via naming.
- Bandwidth remains scarce relative to 4K/8K asset sizes.
- Creative pipelines span multiple tools; proprietary project formats trap history.
- Teams lack reproducibility: “Which build shipped?” often cannot be answered.

## One-Line Solution

- A content-addressed, FastCDC-chunked VCS with manifest-driven file recipes, QUIC-based delta sync, keyframe-aware media handling, and a virtual filesystem for just-in-time hydration—so media versions travel as small deltas, not multi-gigabyte blobs.

## Who It Serves

- Video editors who need to branch timelines without re-uploading source.
- Game developers shipping large builds and hotfix patches efficiently.
- 3D artists managing shared assets across scenes with deduped storage.
- Photographers handling RAW/PSD catalogs with versioned edits and previews.
- DevOps teams integrating media artifacts into CI/CD and artifact stores.
- Studios and enterprises requiring auditability, locking, and compliance.

## Why It Wins vs. Traditional VCS

- Stores only changed chunks, not whole files.
- Deduplicates across files, versions, and even repositories when shared.
- Respects media structure: no chunking through MP4 `moov`; keyframes stay intact.
- Partial clone and on-demand hydration replace full repo downloads.
- Explicit locks prevent binary conflicts; merge semantics reserved for mergeable project files.
- Open protocol and formats; no vendor lock-in.

## Core Architecture (Two-Layer Model)

- Layer 1: Universal bucket — every file chunked via FastCDC, hashed with BLAKE3, stored in a content-addressable store.
- Layer 2: Smart, file-type-aware logic — domain-specific behaviors for video, games, 3D, and photo to maximize dedup and preserve playability.
- Commits: DAG of manifests (file recipes) and trees; Git-like operations with binary awareness.
- Project graphs: optional higher-level graphs for timelines/builds/dependencies.

## Content Pipeline (FastCDC → BLAKE3 → CAS)

- Ingest: stream file bytes through FastCDC; boundaries adapt to content.
- Hash: each chunk hashed via BLAKE3 for speed and parallelism.
- Store: content-addressable store ensures duplicates are stored once.
- Manifest: file version = ordered list of chunk refs + metadata.
- Tree/Commit: repository state = map of paths to manifests, wrapped in a commit.
- Rebuild: read manifest → concatenate chunks → emit file; checksums verified on read.

## Manifest and Index Formats (Highlights)

- Manifest header: magic `MANI`, version, compression flags, checksums, timestamps, repo/commit ids.
- Manifest entries: path, entry type, mode, size, content hash, chunk list, metadata, asset metadata, timestamps.
- ChunkRef flags: keyframe, metadata, encrypted, storage class, compressed size optional.
- Index: `.dits/index` caches staging/working tree; tracks chunk indices, locks, split index, untracked cache, fsmonitor.
- Atomicity: temp + rename; journal-based recovery for index integrity.

## Data Structures (Canonical Objects)

- Chunk: `hash`, `offset`, `size`, optional `compressed_size`, flags.
- Asset: `hash`, `size`, ordered chunk refs, media metadata (duration, resolution, codec, fps, color).
- Manifest: directory tree of manifest entries describing files/symlinks/dirs.
- Commit: hash, parents, tree hash, author/committer, message, timestamp.
- Branch: mutable ref to commit.
- Tag: immutable ref to commit.
- Lock: tracked in index; server-coordinated for multi-user workflows.
- Remote: endpoint + auth; supports S3-compatible storage and QUIC transport.
- Reflog: planned history of ref movements for recovery.

## Algorithms (FastCDC, Keyframe Alignment, Bloom Filters, Delta Sync)

- FastCDC: rolling gear hash, content-defined boundaries, min/avg/max sizing, normalization for smooth distributions.
- Keyframe alignment: parses ISOBMFF (`stss`, `stsz`, `stco/co64`, `stsc`) to align chunk boundaries to keyframes when feasible.
- Transparent decompression: checksum-verified reads with optional on-the-fly decompress; always verify BLAKE3 post-read.
- Bloom filters: compress “have” sets for sync; ~1KB can represent ~10k chunks with low FP rate.
- Delta sync: have/want negotiation to upload only missing chunks; resumable transfers.
- QUIC tuning: idle timeouts, stream limits, congestion control for high throughput.

## Sync and Transport (QUIC Wire Protocol)

- Frames: magic `DITS`, version, type, flags (compressed/encrypted/chunked/final), payload length, request id, payload.
- Message types: PING/PONG, AUTH/AUTH_OK/FAIL, CHECK/UPLOAD/DOWNLOAD, MANIFEST GET/PUSH, SYNC REQUEST/RESPONSE, BLOOM_FILTER, DELTA_REQUEST/DATA.
- Resumable upload: server tracks confirmed bytes; client resumes from last ack.
- Multiplexing: concurrent streams over one QUIC connection; keep-alives for liveness.
- Security: TLS 1.3 over QUIC; planned client-side convergent encryption phase.

## Virtual Filesystem and Locking

- VFS: FUSE/WinFSP mount exposes repo as a drive; hydrates chunks on access; prefers local cache.
- Partial clone: list files without full download; hydrate on-demand.
- Locking: explicit locks for non-mergeable binaries; lock state reflected in index and enforced via server coordination.
- Read-only when locked by others; writable when owned; prevents silent conflicts.

## Storage Layout and Garbage Collection

- `.dits/objects/`: chunk blobs keyed by BLAKE3.
- `.dits/manifests/`: manifest payloads keyed by commit hash.
- `.dits/refs/`: branches and tags.
- Index and merge state: `.dits/index`, `.dits/index.lock`, `.dits/MERGE_*`.
- Reference counting: chunk refs tracked for GC eligibility.
- GC: ref-count driven, with quarantine for corrupted chunks and checkpointing for long sweeps.
- Tier migration: copy-first, update routing, wait for quiescence, then delete source.

## Caching Strategy (Client + Server)

- Client L1: in-memory LRU for hot chunks.
- Client L2: disk cache in `.dits/objects` for recently accessed chunks.
- Server cache: tuneable per backend; optional Redis for coordination.
- Prefetch: when reading chunk N, prefetch N+1/N+2; keyframe-aware hints.
- Bloom filter exchange reduces have-list bandwidth.

## Security and Safety Checklist

- Mandatory checksum verification on every read (BLAKE3).
- No hardcoded secrets; environment/vault only.
- Parameterized queries; avoid string concatenation for SQL.
- TLS 1.3 on transport; QUIC security.
- Advisory locks for atomic ref counts; row locks on critical paths.
- Input validation at boundaries: path traversal rejection, size limits, absolute-path rejection from clients.
- Locking and audit logging for sensitive operations.
- Rate limiting on public endpoints; resource-level permissions.
- Planned convergent encryption with per-repo salt and RBAC key hierarchy.
- Deterministic nonces prohibited; use content hash + randomness for AEAD.

## Performance Targets and Benchmarks

- Chunk 1GB: <5s with FastCDC + parallel hashing.
- Hash 1GB: <1s with BLAKE3 parallelism.
- LAN upload: >500 MB/s; WAN: saturate link.
- Clone 10GB: <2 minutes on 1 Gbps with cache.
- Status: <100ms with index/untracked cache/fsmonitor.
- VFS open: <50ms when cached; streamed when missing.
- Bloom filter have-list: ~1KB for ~10k chunks at ~1% FP.

## Deployment and Self-Hosting

- Docker Compose: dits-server + Postgres + Redis + MinIO; env vars for DB/Redis/S3/JWT.
- Kubernetes: separate config/secrets; readiness/liveness probes; horizontal scaling; persistent volumes for caches.
- S3-compatible storage supported; direct chunk upload; metadata in Postgres.
- Tuning: QUIC parameters, cache sizes, GC windows, lifecycle policies for hot/warm/cold storage.

## Operations and Runbooks (Highlights)

- Network drops: QUIC resumability; resume from confirmed bytes.
- Cache corruption: checksum detect → refetch → quarantine bad objects.
- Lock contention: expose status; admins clear stale locks with audit trail.
- High latency: tune QUIC cwnd/streams/keep-alive; use proxy/hologram mode.
- Storage pressure: run GC, move cold chunks, monitor object growth.
- Runbooks: service down, scaling, database issues, high latency—all documented in `docs/operations/runbooks/`.

## CLI Usage Cheat Sheet

- Initialize: `dits init`
- Add files: `dits add <path>`
- Commit: `dits commit -m "message"`
- Inspect: `dits status`, `dits log`, `dits diff`
- Branch: `dits branch <name>`, `dits checkout -b <name>`
- Tag: `dits tag <name>`
- Restore: `dits restore <path>`
- Mount VFS: `dits mount`, `dits unmount`
- Cache stats: `dits cache-stats`
- Segment/video commands: `dits segment ...` (see command docs)

## Workflows by Persona

- Video editors: version project instructions, reuse source media, keyframe-aligned chunks for fast seek, proxy/hologram editing.
- Game developers: lock binaries, reduce patch size to changed chunks, trace which build shipped, integrate with CI/CD artifact stores.
- 3D artists: dedup shared assets, encourage referenced vs embedded assets, partial clone for heavy scenes.
- Photographers: dedup RAW/PSD layers, version edits as manifests + metadata, cache-first previews.
- Teams: enforce locks, audit access, branch timelines/builds safely.

## SDKs and API Surface

- REST: repos, branches, tags, users/teams, permissions, locks, manifest listing, webhooks.
- Webhooks: push/pull/lock events with documented payloads.
- Wire protocol (QUIC): chunk/manifest operations, sync negotiation.
- SDKs: Rust, Go, Python, JavaScript; consistent chunk/manifest abstractions.

## Roadmap (9 Phases)

- Phase 1: Engine — local chunking/dedup; bit-for-bit checkout.
- Phase 2: Structure awareness — MP4 atom exploder; metadata-only changes avoid re-upload.
- Phase 3: Virtual filesystem — mounted drive; just-in-time hydration.
- Phase 3.5: Git parity milestones.
- Phase 4: Collaboration & sync — QUIC delta sync; push/pull missing chunks only.
- Phase 5: Conflict & locking — binary locks; visual diff assistance.
- Phase 6: The Hologram — proxy-based editing (`checkout --proxy`).
- Phase 7: The Spiderweb — dependency parsing to prevent “media offline.”
- Phase 8: Deep Freeze — tiered storage lifecycle (hot/cold).
- Phase 9: The Black Box — client-side convergent encryption with RBAC keys.

## Business and Compliance Notes

- Open core: self-host fully offline; hosted Ditshub optional.
- Compliance: documented considerations in `business/compliance.md`; audit logging, auth, and permission model.
- Pricing: outlined in `business/pricing.md` for hosted options.
- SLA: service targets in `business/sla.md` for uptime/response.
- Competitors: analysis in `business/competitors.md`; Dits differentiates via content-defined chunking, open formats, and VFS.

## Migration and CI/CD

- Migration guidance in `guides/migration.md`; re-chunk assets, maintain provenance.
- CI/CD integration in `guides/cicd-integration.md`; use manifests as build inputs; push artifacts as chunks.
- Artifact reuse: dedup across builds reduces pipeline transfer costs.

## Edge Cases and Failure Modes (Selected)

- Partial manifest writes: detect via trailing checksum; rebuild from journal.
- Connection drops mid-upload: resumable checkpoints via QUIC.
- Variable frame rate video: adjust keyframe weighting; avoid aggressive shifts.
- Lock staleness: TTL and admin override; audit recorded.
- Reference count underflow: DB constraints; halt GC and rebuild from manifests.

## Known Issues and Solutions (Highlights)

- STOR-C1: missing checksum verification — mandate BLAKE3 verify on read.
- STOR-C2: race in ref counting — use advisory locks + transactions.
- NET-C1: no partition detection — add quorum-based detector.
- SEC-C2: deterministic nonces break AEAD — mix content hash + randomness.
- OPS-C1: manual DB failover — documented runbook and HA guidance.

## Disaster Recovery and Backup

- Backups: documented in `operations/backup-restore.md`; snapshot DB + object store; verify checksums.
- Restore: prioritize manifests + refs; rehydrate chunks; validate hashes post-restore.
- DR drills: recommended cadence and success criteria.
- Rebuild index: recover from journal; verify against manifests.

## Troubleshooting and Quick Fixes

- Quick fix workflow in `workflows/quick-fix.md` for urgent patches.
- High latency: tune QUIC; enable proxy mode; check cache hit rate.
- Missing media: run dependency parser; ensure paths stable via VFS.
- Corruption alerts: quarantine chunk; refetch from remote or peer.

## Team Collaboration Patterns

- Locks to protect non-mergeable assets.
- Branching for timelines/builds; merge where semantic diffs are possible.
- Audit logs for sensitive operations; webhooks to downstream systems.
- Onboarding: `workflows/first-time-setup.md` for new contributors.
- Daily ops: `workflows/daily-workflow.md` for routine use.

## Tech Stack at a Glance

- Language: Rust 1.75+
- CLI: `clap`
- Chunking: `fastcdc`
- Hashing: `blake3`
- Container parsing: `mp4`, `isolang`
- Video inspection: `ffmpeg-next`
- Local DB: `sled`
- Transport: `quinn` (QUIC)
- Server: Axum + PostgreSQL + Redis
- VFS: `fuser` (Unix) / `dokany` (Windows)
- GUI (future): Tauri (React + Rust)

## API Surface (Condensed)

- REST endpoints for repos/branches/tags/users/locks/manifests.
- Webhook payloads documented for push/pull/lock events.
- Wire protocol over QUIC for bulk chunk/manifest transfer.
- Error codes catalogued in `api/error-codes.md`.

## Storage Layout (Condensed)

- Objects: content-addressed chunks.
- Manifests: commit-linked recipes.
- Refs: branches/tags in `.dits/refs/`.
- Index: staging cache with chunk indices.
- Merge state: `MERGE_HEAD`, `MERGE_MSG`.

## Performance and Benchmark Notes

- Hashing throughput benefits from SIMD (AVX2/AVX-512/NEON/AMX).
- Chunking is streaming; memory bounded by buffer and max chunk size.
- QUIC uses keep-alives; max streams configurable.
- Cache hit paths reach 1+ GB/s reads; remote fetch dominated by link speed.

## Security Deep Dive (Highlights)

- JWT-based auth for server; SSO/SAML planned for hosted.
- Resource-level permissions and audit logging.
- Rate limiting across public endpoints.
- No skipping checksum verification; corruption triggers recovery.
- Chunk encryption planned with convergent scheme; keys wrapped per repo.

## Operations: Monitoring and Observability

- Metrics: chunk upload/download rates, cache hit ratio, Bloom FP rate, QUIC RTT, refcount adjustments, GC progress.
- Alerts: checksum failures, lock contention, high latency, storage pressure.
- Logging: structured fields (request_id, user_id, repo_id, chunk_hash).
- Tracing: instrumented critical paths (upload, sync, mount reads).

## Deployment Patterns

- Single-node lab: docker-compose with local disks.
- Small team: compose with S3-compatible backend; nightly backups.
- Production: K8s with HPA, dedicated Postgres/Redis, S3/Blob storage, object lifecycle policies.
- Edge caching: optional CDN/front cache for media-heavy reads.

## Contributing and Development

- Conventional commits; branches `feature/*`, `fix/*`, `docs/*`, `refactor/*`.
- Rust 1.75+, Node 20+ for web UI, Postgres 15+, Docker.
- Run `cargo fmt`, `cargo clippy`, `cargo test` before PRs.
- Plugin SDK guidance in `development/plugin-sdk.md`.

## Testing Strategy (Condensed)

- Unit: chunk determinism, boundary stability, reconstruction.
- Integration: init → add → commit → push → pull → checkout.
- Network fault injection: packet loss/timeouts.
- Concurrency: parallel clients with locks.
- Storage failure: simulate S3 errors, disk full.

## User Guide Pointers

- Getting started: `user-guide/getting-started.md`.
- CLI reference: `user-guide/cli-reference.md`.
- Config reference: `user-guide/config-reference.md`.

## Deployment Guides

- Docker: `deployment/docker.md` for compose setup.
- Kubernetes: `deployment/kubernetes.md` for manifests and tuning.

## Database Schema (Condensed)

- Postgres stores manifests, refs, locks, users, permissions, chunk refs.
- Advisory locks for ref counting; transactions ensure atomic updates.
- Constraints prevent refcount underflow.

## Caching and Client Behavior

- Client index caches file metadata; status diff uses cached hashes.
- Fsmonitor extension for faster status detection.
- Sparse checkout planned via index extensions.

## Virtual Filesystem Experience

- Mount repository; browse without full download.
- Lazy hydration fetches missing chunks when accessed.
- Cache-first; remote fallback; checksum verify on read.
- Supports read-only when locks held elsewhere.

## Locking and Collaboration

- Lock API to acquire/release; reflects in index flags.
- Binary assets treated as non-mergeable; locking is first-class.
- Audit logs capture lock lifecycle.

## Roadmap Notes (Phases Expanded)

- Phase 1: local engine, chunk store, BLAKE3, manifests, commits.
- Phase 2: MP4 atom awareness, metadata diffs, keyframe detection.
- Phase 3: VFS mount, hydration strategy, cache hints.
- Phase 4: QUIC sync, Bloom filters, resumable uploads.
- Phase 5: lock manager, conflict surfacing, visual diff exploration.
- Phase 6: proxy/hologram editing for low-bandwidth workflows.
- Phase 7: dependency parsing to stop “media offline.”
- Phase 8: storage lifecycle with tiering and thawing.
- Phase 9: client-side convergent encryption with RBAC.

## Business Layer Details

- Pricing tiers described for hosted offering; self-host remains free/open.
- Compliance focus: auth, audit, encryption plans, data residency via S3 selection.
- SLA targets: uptime, response windows, and support channels.

## Competitor Positioning

- Git LFS: pointer-based; Dits is first-class CAS with dedup and VFS.
- Perforce: centralized/proprietary; Dits is distributed/open with chunk dedup.
- Cloud drives: lack history and dedup; Dits provides versioned manifests and chunk reuse.

## Migration Guidance (Condensed)

- Re-chunk existing assets; maintain path mapping.
- Validate reconstructed outputs against source via checksum.
- Stage migration in phases: pilot repo, then broad rollout.

## CI/CD Integration (Condensed)

- Use manifests as immutable build inputs; avoid re-uploading artifacts.
- Cache-aware pipelines reduce bandwidth; only changed chunks move.
- Webhooks trigger downstream builds/tests on push/pull/lock events.

## Edge Cases (More Detail)

- Missing keyframe table: treat all frames as keyframes (ProRes/DNxHD).
- Long-GOP gaps: insert intermediate CDC boundaries respecting max size.
- Sparse files: handle via chunk metadata; avoid unnecessary uploads.
- Large directories: index sharding planned for scale.

## Failure Modes and Handling

- Partial transfers: resumable; verify checksums; retry idempotently.
- Corrupt chunk detection: quarantine and restore from replica/remote.
- Tier mismatch: correct routing; revalidate after migration.
- Lock expiration: leases with TTL; admin override recorded.

## Disaster Recovery (More Detail)

- Backup cadence: DB + objects; verify with checksum.
- Restore ordering: DB first, then objects, then cache warmup.
- GC safety: checkpointing; resume sweeps after interruption.
- Incident runbooks: service down, scaling, high latency, DB issues.

## Troubleshooting Playbook

- VFS slow: inspect cache hits, network RTT, QUIC stream counts.
- Sync stuck: check Bloom filter mismatch, permissions, lock states.
- Status incorrect: rebuild index from journal; verify fsmonitor state.
- High storage: run GC; review dedup ratio; move cold tiers.

## Team Collaboration (Expanded)

- Branch per timeline/build; merge when safe, otherwise lock.
- Permissions per repo; audit logs for sensitive actions.
- Webhooks to notify render farms/CI of new commits or locks.
- Onboarding guide for first-time setup; daily workflow recommendations.

## Tech Stack Notes (More Detail)

- Axum server with tower middleware; tracing for observability.
- SQLx with compile-time query checking for Postgres.
- Redis for lock coordination and cache hints.
- Quinn for QUIC; configurable stream counts and idle timeouts.
- Fuser/Dokany for VFS; platform-specific tuning.

## Testing (Expanded)

- Determinism tests ensure identical chunks for identical input.
- Boundary stability tests validate minimal drift after inserts/deletes.
- Reconstruction tests ensure byte-exact output.
- Integration tests cover push/pull with missing chunks and resume.
- Fault injection for network/storage/lock races.

## Performance (Expanded)

- SIMD acceleration for hashing/chunking on x86_64/ARM.
- io_uring on Linux for async I/O (where available).
- Connection pooling and keep-alives for QUIC.
- Prefetch heuristics for sequential reads; keyframe-aware.

## Safety and Security (Expanded)

- AES-GCM planned for encrypted chunks; convergent scheme with salt.
- Nonces derived from content hash + random component.
- Strict input validation on paths; reject traversal and oversize inputs.
- Zero logging of secrets; sensitive data redacted.
- Audit logging with request/user/repo context.

## Glossary (Extended)

- CDC: Content-defined chunking; boundaries follow content patterns.
- FastCDC: Optimized CDC variant with normalization and gear hash.
- CAS: Content-addressable store; objects keyed by hash.
- Chunk: Small binary unit with hash, size, offset.
- Manifest: Recipe describing how to rebuild a file from chunks.
- Tree: Directory mapping of manifests.
- Commit: Snapshot pointing to a tree with parents, metadata.
- Bloom filter: Probabilistic set used to compress have-lists.
- Have/Want: Sync negotiation of existing/missing chunks.
- QUIC: UDP-based, TLS 1.3 transport with multiplexed streams.
- VFS: Virtual filesystem exposing repo as mounted drive.
- Lock: Coordination primitive to prevent binary conflicts.
- Keyframe alignment: Adjusting chunk boundaries to video keyframes.
- Moov atom: MP4 metadata box kept intact for playability.
- Hologram: Proxy/low-bitrate editing mode planned.
- Spiderweb: Dependency parsing to avoid missing media.
- Deep Freeze: Tiered storage lifecycle phase.
- Black Box: Client-side convergent encryption phase.
- Index: Staging/working tree cache with chunk info and locks.
- Reflog: Planned history of ref movements for recovery.
- Chunk refcount: Number of manifests referencing a chunk; drives GC.
- Tier migration: Moving chunks between hot/warm/cold storage safely.
- Saga: Multi-step workflow with compensating actions.
- Fsmonitor: Filesystem monitoring to speed status detection.
- Sparse checkout: Planned selective materialization of paths.
- Proxy: Lower-res asset for editing without originals.
- Partial clone: Clone metadata without all objects; hydrate on access.
- Bloom FP rate: False-positive rate tuning for have-lists.
- Idle timeout: QUIC setting governing connection liveness.
- Keep-alive: Periodic ping to maintain QUIC connections.
- Chunk mask: Bitmask controlling boundary probability in FastCDC.
- Normalization: Technique to smooth chunk size distribution.
- Sync stream: QUIC stream carrying sync frames.
- Chunk upload ack: Server confirmation of received bytes.
- Lock TTL: Expiry for locks to prevent staleness.
- Audit log: Record of sensitive operations.
- Asset metadata: Duration, resolution, codec, fps, color for media.
- Chunk flags: Indicators such as keyframe, metadata, encrypted.
- Entry type: file/symlink/dir/submodule in manifest entries.
- Manifests dir: On-disk store for manifest payloads.
- Objects dir: On-disk store for chunk blobs.
- Refs dir: On-disk store for branches/tags.
- Merge state: Files tracking merges in progress.
- GC checkpoint: Progress record for long garbage-collection cycles.
- Quarantine: Holding area for suspected-corrupt chunks.
- Bandwidth estimation: Protocol logic to adapt rates.
- Partial hydration: Fetch only needed chunks during read.
- Offset map: Mapping from file offsets to chunk ranges.
- Cache hint: Prefetch suggestion based on access patterns.
- Request id: Correlator in wire frames for tracing.
- Flags bitfield: Frame flags indicating compression/encryption/chunked/final.
- Payload length: Frame field describing size.
- Sync delta: Only missing chunks transferred.
- Index lock: File to ensure atomic index writes.
- Journal: Append-only log for index recovery.
- Chunk GC eligibility: Determined by refcount zero and grace period.
- Grace period: Minimum age before deletion to avoid races.
- Bloom serialization: Compact byte representation of have-lists.
- Chunk hash collision: Mitigated by BLAKE3 robustness.
- Path normalization: Ensuring consistent path formats across OSes.
- Case sensitivity: Cross-platform path handling consideration.
- Mode: File permission stored in manifest entries.
- Repo id: Identifier stored in manifest payload header.
- Commit parents: Enables DAG and merges.
- Tag immutability: Tags do not move once set.
- Branch mutability: Branch refs move with new commits.
- Chunk offsets: Byte offsets inside original file.
- Compressed size: Optional field when chunks are compressed.
- Storage class: Flag for hot/cold tier designation.
- Encrypted flag: Indicates encrypted chunk payload.
- Metadata flag: Marks metadata-only chunks.
- Keyframe flag: Marks chunks aligned to keyframes.
- Bloom seeds: Parameters for consistent Bloom filters.
- Mask_s / mask_l: FastCDC masks for pre/post-avg regions.
- Max_shift: Limit for keyframe alignment adjustments.
- Avg_size: Target chunk size in FastCDC.
- Min_size: Lower bound on chunk size.
- Max_size: Upper bound on chunk size.
- Gear table: Precomputed table for FastCDC rolling hash.
- Rolling hash: Mechanism for detecting content-defined boundaries.
- SIMD: CPU vectorization to accelerate hashing/chunking.
- io_uring: Linux async I/O facility for performance.
- LRU cache: Least-recently-used policy for chunk cache.
- Bloom FP: False-positive probability; tune via bit count per entry.
- Stream limit: QUIC max concurrent streams.
- Congestion window: QUIC parameter for throughput.
- TLS 1.3: Security layer for QUIC.
- Request timeout: Explicit timeouts on external calls.
- Rate limiting: Protection on public endpoints.
- RBAC: Role-based access control for hosted offering.
- SSO/SAML: Planned enterprise auth integration.
- Audit fields: request_id, user_id, repo_id for logs.
- Incident ticket: Manual follow-up for failed compensations.
- Cache stats: CLI command showing cache hit/miss.
- Segment commands: Video-aware CLI operations.
- Partial clone UX: See tree, hydrate on open.
- HPA: Horizontal Pod Autoscaler for K8s deployments.
- Lifecycle policy: Object storage tiering rules.
- Bloom filter size: Tuned to chunk count for sync efficiency.
- Hash verification: Mandatory on reads; critical safety rule.
- Convergent encryption: Dedup-preserving encryption with per-repo salt.
- Nonce derivation: Combine content hash + randomness.
- Checksum mismatch: Triggers recovery workflow.
- Chunk recovery: Fetch from replicas/remote; quarantine bad copy.
- Reference integrity: Hash-based validation of manifests.
- Split index: Index optimization for large repos.
- Untracked cache: Speeds status by caching untracked files.
- Fs events: Used by fsmonitor to detect changes.
- Proxy editing: Work on proxies while originals stay remote.
- Dependency graph: Tracks asset relationships to prevent missing media.
- Cold storage thaw: Bringing cold chunks back to hot tier.
- Bloom compression: Reduces have-list bandwidth.
- Manifest delta: Potential future optimization for manifest diffing.
- Remote: Endpoint representing storage + metadata service.
- Push: Upload missing chunks/manifests to remote.
- Pull: Fetch missing chunks/manifests from remote.
- Status: Compare working tree to index and HEAD.
- Diff: Compare manifests/commits to see changes.
- Log: View commit history.
- Revert: Restore paths from commits.
- Restore: Replace working tree paths from index/commit.
- Tag: Named pointer to commit.
- Branch: Movable pointer to commit.
- Merge: Combine commits; locks help for binaries.
- Conflict: Resolved via locks or manual steps for mergeable files.
- Storage backend: Local disk, S3-compatible, others.
- Scheduler: Governs parallel uploads/downloads.
- Backpressure: Flow control in QUIC streams.
- Telemetry: Metrics + traces for runtime insight.
- Incident response: Runbooks for failures.
- Health checks: Probes for services.
- SLA clock: Timers for uptime/response.
- Compliance logging: Audit trails for sensitive actions.
- Data residency: Choose storage region via S3 backend.
- Rollback: Use commits/tags to return to prior state.
- Immutable objects: Chunks/manifests never mutate; only refs move.
- DAG: Directed acyclic graph of commits.
- Parent pointers: Enable merges and history traversal.
- Clone: Copy repo metadata and optionally objects.
- Init: Create new repository state.
- Add: Stage files (chunk + index entry).
- Commit message: Records why/what changed.
- Author/committer: Recorded in commit metadata.
- Timestamp: Stored in commit and manifest entries.
- Mode bits: Preserve file permissions.
- Symlink entry: Stored as target path, not followed.
- Submodule entry: Supported entry type.
- Directory entry: Captured in manifest directories.
- Timestamps: ctime/mtime in index entries.
- Flags: Index flags for stage/assume-unchanged/locked/chunked/modified.
- Split index: Optimize for large repos.
- Untracked cache: Cache of untracked files for speed.
- Tree cache: Optional cached directory structure.
- Reuse cache: Undo data for conflicts.
- Fsmonitor: Monitors filesystem for faster status.
- Sparse: Planned partial index population.
- Bloom bits per entry: Determines FP rate.
- Dedup ratio: Metric for storage savings.
- Physical vs logical size: Stored bytes vs user-visible size.
- Cache eviction: LRU policy.
- Hydration: Fetching chunks to fulfill read.
- Dehydration: Dropping cached chunks when space needed.
- GC grace period: Time before deleting unreferenced chunks.
- Journal replay: Recover index after crash.
- Atomic rename: Temp -> final write pattern.
- Payload compression: Optional zstd on frames.
- Compression flag: Marks compressed frame payloads.
- Encryption flag: Marks encrypted frame payloads.
- Chunked flag: Frame spans multiple chunks.
- Final flag: Last frame in sequence.
- Request correlation: Request id in frames.
- Retry budget: Limits retries on failures.
- Rate limit policy: Protects endpoints.
- SLA monitor: Tracks uptime/latency.
- Incident severity: Levels for response.
- Postmortem: Process for incidents.
- Benchmarks: Documented in `performance/benchmarks.md`.
- Tuning guide: `operations/performance-tuning.md`.
- Backup guide: `operations/backup-restore.md`.
- Monitoring guide: `operations/monitoring.md`.
- Troubleshooting guide: `operations/troubleshooting.md`.
- Runbooks: Database issues, scaling, service down, high latency.
- First-time setup: `workflows/first-time-setup.md`.
- Daily workflow: `workflows/daily-workflow.md`.
- Disaster recovery: `workflows/disaster-recovery.md`.
- Team collaboration: `workflows/team-collaboration.md`.
- Quick fix: `workflows/quick-fix.md`.
- Migration: `guides/migration.md`.
- CI/CD: `guides/cicd-integration.md`.
- SDK docs: `sdks/*.md` for language guides.
- Format specs: `formats/manifest-spec.md`, `formats/index-spec.md`.
- Tech stack overview: `tech-stack.md`.
- Roadmap: `roadmap/phases.md`.
- Action plan: `action-plan/phase*.md`.
- Algorithms: `algorithms/*` for fastcdc, keyframe, bloom, delta sync.
- Architecture deep dives: `architecture/*`.
- Business docs: `business/*` for pricing, sla, competitors, compliance.
- Data structures: `data-structures/*` for core object schemas.
- Deployment: `deployment/*` for docker/k8s guides.
- Operations: `operations/*` for monitoring/perf/runbooks.
- Parsers: `parsers/*` for ISOBMFF and NLE handling.
- Performance: `performance/benchmarks.md`.
- Testing: `testing/*` for compatibility and plans.
- User guide: `user-guide/*` for CLI/config/how-to.
- Workflows: `workflows/*` for practical guides.

## FAQ (Condensed)

- How is this different from Git LFS? Built for binaries from the ground up; content-defined chunking; VFS; dedup across repos; open formats.
- Can I use it offline? Yes, full local workflow; remotes optional.
- What file types? Any; video gets format-aware optimizations; works for games, 3D, photos, code if desired.
- How are locks enforced? Distributed locks with TTL and server coordination; index reflects state; read-only when locked by others.
- What happens on corruption? Hash mismatch triggers recovery from replicas/remote; quarantine bad chunk.
- How resumable are uploads? QUIC resumable uploads resume from last confirmed byte.
- How do I deploy? Docker Compose for small teams; Kubernetes for production; S3-compatible storage supported.
- How do I back up? Backup DB + objects; verify checksums; follow DR guide.
- Does it support encryption? Planned convergent encryption (Phase 9); TLS 1.3 already.
- How fast is it? Chunk 1GB <5s; hash 1GB <1s; LAN uploads >500 MB/s; status <100ms.

## Contact and Links

- Repo: https://github.com/byronwade/dits
- Docs: see `docs/architecture/overview.md` and related files listed above.
- Email: dev@dits.io
- Discord: #dev channel
- Quick install: `curl -fsSL https://raw.githubusercontent.com/byronwade/dits/main/install.sh | sh`

## Closing Note

- Dits aims to be the Git of heavy media: deduped, verifiable, fast, open, and fit for modern creative and game pipelines.
- This summary captures the documented system; see source docs for deeper implementation details.
- Contributions and feedback welcome—open issues or join the discussion.

