---
title: "Wormhole — Mount Any Folder. Any Computer. No Setup."
url: "https://wormhole.byronwade.com"
category: "Product"
type: "product"
date: 2025-12-09
excerpt: "Peer-to-peer distributed filesystem: share a folder with a join code and mount it anywhere—no uploads, no accounts, zero monthly fees."
---

# Wormhole - Mount Any Folder. Any Computer. No Setup.

Wormhole is a peer-to-peer distributed filesystem: share any folder with a join code and mount it elsewhere as if it were local. No cloud uploads, no accounts, zero monthly fees.

## Why It Exists

- Time cost: Cloud sync forces full uploads before anyone can work; a 50GB render easily burns 30+ minutes per handoff.
- Money cost: Creative teams pay $50+/month for storage they already own.
- Privacy cost: Third parties store, scan, and control access to your files.
- Promise: Host a folder, share a code, collaborators mount instantly. Files never leave your machines.

## Who It Helps (and How)

- Video editors / VFX: Mount render/output folders immediately; start editing while frames are still rendering; avoid multi-gig uploads.
- Game developers: Mount build artifacts across platforms for rapid QA and smoke tests without packaging every build.
- Privacy-first teams: Keep data on-network; end-to-end encrypted transport; open-source code path for verification.

## How It Helps (Step-by-Step, No External Docs)

1) Host: `wormhole host ./project` walks the directory, builds metadata, opens a secure QUIC endpoint.
2) Signal: A lightweight WebSocket service exchanges rendezvous info, runs PAKE to derive keys, and helps with NAT traversal.
3) Connect: Guest enters the join code in the app/CLI; both sides derive session keys and open a QUIC tunnel.
4) Mount: Guest mounts via FUSE (macOS/Linux) or WinFSP (Windows); inode map serves getattr/readdir immediately.
5) Read: Byte-range reads stream over QUIC; hot chunks cache in RAM (128KB) and spill to disk cache when present.
6) Govern/Clean: Prefetch governor reads ahead; garbage collection trims stale cached chunks; strict timeouts stop hung handshakes/requests.
7) Writes (roadmap): Later phases add bidirectional writes, locks, conflict resolution while keeping backward compatibility.

## What It Is Made Of (Concrete Architecture)

- teleport-core (Rust): NetMessage protocol, SPAKE2 join-code crypto, share-link parsing, type definitions, bincode serialization.
- teleport-daemon (Rust): QUIC transport, host/client actors, FUSE/WinFSP filesystem, inode map, RAM and disk cache, prefetch governor, garbage collector, lock manager, config loader, CLI binary.
- teleport-signal (Rust): Axum WebSocket server, room coordination, SQLx persistence, health endpoints, Fly.io-ready.
- Desktop (Tauri + React 18 + Tailwind): Thin UI over Rust commands; large monospace join codes with copy; onboarding with Gatekeeper guidance; platform-aware downloads; app-wide error boundary.
- Protocol stance: Request/response plus streaming over QUIC; additive evolution via optional fields to stay backward compatible.

## How It Works Under the Hood (Technical Backbone)

- Transport: QUIC (quinn) with TLS 1.3; session keys derived from SPAKE2-based join-code PAKE.
- Filesystem: fuser on Unix, WinFSP on Windows; getattr updated for latest fuser API; inode cache reduces repeated lookups.
- Caching: 128KB chunk size; RAM cache for hot reads; disk cache for reuse/offline; GC bounds storage.
- Path safety: Path sanitization blocks traversal; daemon avoids panics (`unwrap`) on untrusted paths.
- Timeouts: Handshake, stream accept, Hello/HelloAck, and request timeouts on both host and client to prevent stalls.
- Performance hygiene: Avoid cloning large buffers; prefer references/Arc; drop locks before awaits in async paths.

## Experience Details (What Users See)

- Join codes: Large monospace display, one-click copy; links use wormhole.byronwade.com.
- Onboarding: Setup wizard explains macOS Gatekeeper; offers right-click Open and terminal fallback `xattr -cr /Applications/Wormhole.app`.
- Downloads: Platform-aware buttons pick latest GitHub release asset; deep links try app first, then fall back to download.
- Resilience: Error boundary wraps the desktop app to avoid white screens on React errors.

## Current State (Branch Snapshot)

- Domains: Share links and parsing use `wormhole.byronwade.com`; default signal server `wss://wormhole-signal.fly.dev`.
- Networking: Host and client handshakes run under timeouts; getattr matches latest fuser signature.
- Desktop: Error boundary added; setup wizard cleans copy timeouts and clarifies Gatekeeper steps.
- Web: Join/home pages auto-pick platform assets; navigation uses Next.js links; download CTAs route per-OS.
- CI: Frontend job runs pnpm install, typecheck, and tests for apps/desktop.

## Roadmap by Phase (What Ships When)

- Phase 1 - Hello World FS: QUIC metadata listing, FUSE skeleton, inode mapping.
- Phase 2 - P2P Tunnel: Remote file reads, byte ranges, request timeouts, hardened connections.
- Phase 3 - Integration: Streaming reads, RAM cache (128KB), prefetch governor.
- Phase 4 - Performance and Caching: Disk cache, LRU eviction, offline reads.
- Phase 5 - Product Wrapper: Desktop polish, installers, system tray UX.
- Phase 6 - Security and NAT: PAKE join codes, hole punching, strict timeouts, hardened signaling.
- Phase 7 - Release Ops: Bidirectional writes, locks, conflict resolution, final polish.

## Security Model (Practical)

- Authentication: Join codes feed SPAKE2 PAKE; session keys derive before any data flows.
- Encryption: TLS 1.3 over QUIC; only minimum routing metadata is exposed.
- Validation: Path sanitization for all network-provided paths; strict root containment; no traversal.
- Resilience: Timeouts on handshake and message exchange; clean error returns instead of panics.
- Compatibility: Protocol changes are additive with optional fields to avoid breaking older clients.

## Performance Model (Practical)

- Chunking: 128KB fixed size for transport and cache alignment.
- Hot path: RAM cache serves re-reads; disk cache speeds cold starts and offline reads.
- Prefetch: Governor issues ahead-of-need reads using access hints.
- GC/Eviction: Periodic garbage collection bounds disk use; LRU where applicable.

## Install and Platform Notes

- macOS: Install macFUSE (`brew install --cask macfuse`). First launch may need right-click Open; terminal fallback `xattr -cr /Applications/Wormhole.app`.
- Windows: Requires WinFSP and typically WebView2; QUIC + WinFSP enable mounting.
- Linux: Needs FUSE3 plus OpenSSL/WebKit/GTK dev deps for Tauri; verify with fusermount3.

## Quick CLI Demo

```bash
# Host a folder
wormhole host ~/Projects/video-edit
# Share link: wormhole.byronwade.com/j/MARS-WIND

# On another machine
wormhole mount wormhole.byronwade.com/j/MARS-WIND ~/mnt/wormhole
```

## Links

- App and docs: https://wormhole.byronwade.com
- Source: https://github.com/byronwade/Wormhole
- Signal server: wss://wormhole-signal.fly.dev

## Contact

byron@byronwade.com - Feedback and collaborators welcome.
