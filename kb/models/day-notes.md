---
type: Data model
title: Personal journey day notes and arrangement rules
---

# Personal day metadata

The current version-1 journey may include `dayNotes`, an array of at most 30 records. Each has a unique integer `day` from 1 to 30, a string `title` of at most 80 JavaScript string units, and string `notes` of at most 2,000 units. Empty strings are permitted: an intentionally open day still exists. Text limits follow browser maxlength semantics, not a promise of 2,000 grapheme clusters in every script.

The version-2 library continues to contain independent version-1 journeys. Current validation, backups, imports, duplication and day operations preserve day metadata; old backups remain valid without it. Older client versions may discard new optional fields. Keep current backups and use the current client to restore them. This is not a cross-version round-trip guarantee.

A day group exists if it has a saved item or a day-note record. Day 0 remains Ideas for later and cannot have day metadata. Groups sort by positive day, then day 0. An empty day is removable through confirmation, with guarded undo until a newer edit.

Moving ideas changes only their day and retains each item’s ID and notes. It appends after the destination’s existing items and leaves source-day metadata in place. Shifting planned days changes positive item days and metadata together, keeps day 0 and startDate fixed, and validates the entire result before returning. Out-of-range or fractional changes fail without mutation.

Undo stores a before-copy and an exact validated after-snapshot in memory, tied to the current journey. It refuses when newer plan content differs. It is not a durable revision history and does not survive reload. Copying between trips retains the original item, resets the copied day to 0, and excludes source-day metadata. Duplicate IDs and capacity overflow fail atomically.

Day titles, day notes and item notes are all personal writing. The book/print inclusion switch covers all three. Backups remain complete. Data stays in browser storage or a file explicitly exported by its owner. No personal journeys are committed into the public KB; test evidence uses synthetic examples.

[Delivery scope and evidence](../research/product/next-210.md).
