---
title: "Dits, Media-First Version Control"
url: "https://dits.byronwade.com"
category: "Hobby"
type: "hobby"
date: 2025-12-09
excerpt: "A local-first Rust version-control alpha for code and large media: Git-backed text history plus content-addressed binary chunks. Remote sync is still planned."
status: "Archived"
featured: false
---

# Dits, Media-First Version Control

Dits is my experiment in versioning projects that mix code with large media
files. The working part is local history: text goes into an embedded Git store,
binary assets are split into reusable chunks, and a committed file can be
rebuilt byte for byte from what was stored.

The [source is on GitHub](https://github.com/byronwade/dits). It is an alpha,
not a finished collaboration service. This write-up first went up in December
2025; the details below were checked on October 21, 2026 against
[main at `cc30c40`](https://github.com/byronwade/dits/tree/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147).

## The problem

A creative project can hold source code, edit decisions, video masters,
textures, and generated builds. Copying the whole folder for each revision loses
the link between those files, and storing every binary revision as a new
whole-file copy uses a lot of space.

I wanted one local history that stores different kinds of content in different
ways. Byte-identical regions of a file can be reused between versions. A video
that was re-encoded may look the same but share very few bytes, so it will not
deduplicate.

## What the local engine does

The Cargo workspace has two parts: a shared Rust chunking and hashing library,
`packages/dits-core`, and the library and command-line tool in `apps/cli`. An
older hosted backend lives under `legacy/` and is not part of the current
product.

The [repository code](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/repository.rs)
ties the steps together:

1. `init` creates the `.dits` folder and an embedded Git store.
2. `add` sorts files. Supported text goes into Git blobs; binary files are
   split into Dits chunks, with a separate path for some MP4 structures.
3. FastCDC picks chunk boundaries from the content itself, and BLAKE3 gives
   each chunk its ID, so a chunk that already exists is reused instead of
   stored again.
4. A commit writes a manifest (the list of chunks that make up each file) and a
   commit object, then moves the current branch.
5. Checkout rebuilds the files for the chosen commit from those stored pieces.

Binary files of 1 MiB or more are read as a stream, so memory use follows the
chunk size instead of the file size. Text files and the MP4 path can still read
a whole file into memory.

The tool also covers local branches, tags, diffs, restore, and a read-only
`fsck` check. Cloning works only between local folders and copies committed
history, not uncommitted edits or locks. The project's own
[status page](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/STATUS.md)
lists the limits command by command.

## Trying it locally

After installing or building the tool with the
[getting-started guide](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/docs/user-guide/getting-started.md),
you can try it in a scratch folder that has a `notes.txt` and a `sample.bin`:

```bash
dits init
dits add notes.txt sample.bin
dits status
dits commit -m "First local snapshot"
dits log
dits branch review
dits checkout review
dits fsck
```

Creating a branch and switching to it are
[separate commands](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/main.rs);
there is no `checkout -b`. There is no one-line `curl` installer either. The
guide lists the platform builds that are published and how to build from
source.

## Integrity and its limits

The [object store](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/store/objects.rs)
re-hashes chunks and manifests when it loads them and checks each commit against
its own hash, and it refuses anything that does not match. Text files are read
back through the embedded Git store instead. While a binary file is being
added, Dits watches its size and modified time and stops if the file changes
part way through.

That is not full crash recovery. A commit updates several files one after
another, not as a single transaction, and not every command writes to the
reflog. Garbage collection only reports what it would delete
(`gc --dry-run`); deleting is turned off. Keep separate backups.

## Media and filesystem experiments

There is real media code: reading and rebuilding some MP4 structures, splitting
and joining segments, making proxies, and FFmpeg-based experiments with video
and photo identity. It is tested on a limited set of files, so it is not general
MP4 or MOV support.

An optional build flag (`fuser`) adds a local, read-only FUSE mount. There is
no Windows version of the mount and it does not pull missing media from a
server. File locks are local records only; they do not coordinate between
people on different machines.

## What is still planned

In the reviewed code, `push`, `pull`, `fetch`, and `sync`
[return an error](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/apps/cli/src/commands/repo/push.rs)
and change nothing. There is an in-process QUIC demo and a small HTTP server for
objects, but neither is a full way to exchange repositories between machines.
The HTTP `serve` command has no login or permissions, listens only on the local
machine by default, and should not be put on the public internet. The early
repository-encryption experiment is turned off.

Hosting, REST APIs, webhooks, official SDK packages, shared locks, remote file
hydration, deduplication across customers, and a full edit and rendition
history are still designs.

## Performance

The repository includes
[benchmark results](https://github.com/byronwade/dits/blob/cc30c403f1c81d8c5e6ebdf8e568d61e0bd6a147/benchmarks/latest.json)
with the commit, machine, and workload each number came from. They are
measurements from one Linux machine, not a promise of network speed or of how
Dits will handle a real media library. The earlier version of this page listed
speed targets as if they had been measured; they had not, and they are gone.

For this update I read the source and its published evidence. I did not run the
build, the tests, or the benchmarks. The file-by-file notes are in the
[project source notes](https://github.com/byronwade/byronwade.com/blob/main/docs/PROJECT_SOURCES.md#dits-local-engine-and-roadmap-claims-october-21-2026).

What exists today is a local version-control alpha with real storage and
integrity work. Before it can be a tool for teams, it needs a tested way to move
repositories between machines.
