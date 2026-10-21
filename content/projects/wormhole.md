---
title: "Wormhole, Mount Any Folder. Any Computer. No Setup."
url: "https://wormhole.byronwade.com"
category: "Product"
type: "product"
date: 2025-12-09
excerpt: "A Rust peer-to-peer folder mount. Share a directory with a six-character join code and open it through FUSE or WinFSP. Writes are off unless you ask, and the signal server does not punch through NAT."
status: "Archived"
featured: false
---

# Wormhole, Mount Any Folder. Any Computer. No Setup.

Wormhole shares a folder from one computer and mounts it on another. The host
listens with QUIC. A guest uses a short join code, or a direct address, and the
files show up through FUSE on macOS and Linux or WinFSP on Windows.

The [source is on GitHub](https://github.com/byronwade/Wormhole). This write-up
first went up on December 9, 2025, the same day the public repository was
created. The details below were checked on October 21, 2026 against
[main at `60151d94`](https://github.com/byronwade/Wormhole/tree/60151d94a1e4eadc5ca483bb35c7d45a056cceb0).
GitHub does not mark the repository archived. Archived on this page is this
site's grouping. The newest GitHub release,
[v0.2.0](https://github.com/byronwade/Wormhole/releases/tag/v0.2.0), is from
August 3, 2026, before the commit reviewed here, so an installer from that tag
can differ from this source.

## What the commands do

`wormhole host <path>` shares one directory. It listens on port 4433 by
default, makes a join code, and prints a link on
`https://wormhole.byronwade.com/j/` plus that code. Sharing is read-only unless
you pass `--allow-write`. The default transport is `quic` (Quinn, with TLS
through rustls). A second transport, `iroh`, is compiled into the default
build and selected with `--transport iroh`.

Join codes are six characters from an alphabet that skips look-alike letters,
shown as `ABC-XYZ`. The old example `MARS-WIND` is eight letters, so the parser
rejects it. `wormhole mount` accepts the code, the web link, or a `wormhole://`
link.

`wormhole mount` then asks the host for file data in 128 KiB chunks. The mount
keeps up to 4,000 of those chunks in memory, which is 500 MiB, and can spill
them to a disk cache under the user cache directory. When that disk cache
starts, the mount helper also starts a garbage collector whose cap is 10 GiB.
Sequential reads prefetch a few chunks ahead.

The host can accept writes. The write handler checks a lock token and a BLAKE3
checksum, refuses a path that escapes the shared folder, and writes the bytes
into the hosted file. The mount itself starts read-only. This review did not
run a two-computer write.

## The pieces in the repository

The Cargo workspace is version 0.2.0. Each crate declares
`MIT OR Apache-2.0`. The repository root has no `LICENSE` file, so GitHub's
license field is empty.

`teleport-core` holds the message types, path checks, the SPAKE2 exchange used
with join codes, and share-link parsing. Peers send legacy bincode, or postcard
when both sides advertise it.

`teleport-daemon` is the `wormhole` and `wormhole-mount` programs: the QUIC
host and client, FUSE, WinFSP, the caches, prefetch, and locks.

`teleport-signal` is a WebSocket rendezvous server built with
tokio-tungstenite. It is not Axum, and SQLx is not a dependency. The server
that accepts connections keeps rooms in memory. A rusqlite store exists, and
`wormhole-signal --db` opens that file and logs how many rows it has, but the
open store is never handed to the server. Restarting the process drops the
rooms.

`apps/desktop` is a Tauri app on React 19.1 and Tailwind 4. The setup screen
explains the macOS Gatekeeper warning and shows
`xattr -cr /Applications/Wormhole.app`. An error boundary wraps the window.
The repository's CI installs that app with pnpm and runs its type check and
tests, separate from the Rust tests.

`apps/web` is the marketing site. Its canonical address is
`https://wormhole.byronwade.com`. The pricing page lists a free tier, Pro at
$8 a month, and Team at $15 a user. Pro and Team are labeled as coming after
launch. Those figures are copy in the repository. This review did not find a
checkout, and it did not confirm that anyone is charged.

The CLI's default signal address is `wss://wormhole-signal.fly.dev`. This
review did not prove that host answers. `--no-signal` skips registration and
leaves a direct address.

## What the flags do not do

`wormhole signal` can print that STUN or TURN is enabled. Those switches are
not passed into the server. The server binds a TCP port, accepts WebSocket
upgrades, and keeps rooms in memory. It does not punch a hole through NAT. On
the public internet the two computers still need a reachable address, or a
signal deployment that actually helps them meet. The CLI points at a direct
address when signaling is not enough.

An optional cloud crate can issue mount tokens and describes billing webhook
shapes. It is off unless the `cloud` Cargo feature is turned on. It is not the
path that shares a folder.

## Install notes that match the source

Mounts need macFUSE on macOS, WinFSP on Windows, and FUSE 3 on Linux. The
README also points at `scripts/install.sh`, `scripts/install.ps1`, and the
v0.2.0 release files. This review did not run the installers or Wormhole's
tests.

The file-by-file notes are in the
[project source notes](https://github.com/byronwade/byronwade.com/blob/main/docs/PROJECT_SOURCES.md#wormhole-mount-and-signaling-claims-october-21-2026).

For this update I read the source. I did not build Wormhole, run its tests, or
mount a folder. That does not establish that a release installer works, that
the default signal host answers, or that two computers on different networks
can connect.
