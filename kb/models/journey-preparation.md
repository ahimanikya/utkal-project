---
type: Data model
title: Journey reminders and portable day selection
---

# Journey reminders and portable day selection

This extension lets a visitor keep practical questions with a personal journey and carry a smaller book for one day. It belongs to UTP’s browser-only planner. Ahimanikya Satapathy retains editorial and release authority; no user account, external storage service or AI persona activation is added.

## Personal reminder data

An optional `reminders` array belongs to a version 1 journey inside the existing version 2 collection. Each of up to 40 entries has a unique `id`, a nonblank `text` string of up to 500 JavaScript string units, and a boolean `done`. The identifier uses the existing lowercase alphanumeric, underscore and hyphen convention, bounded to 80 characters. Unknown valid IDs survive current-client import and export. No external link or executable markup is stored in a reminder.

The add form and explicit Save wording action trim surrounding whitespace. Imported valid text is preserved. Editing keeps the ID and position; toggling keeps the wording. Removing saves one in-memory undo record for that journey. Undo restores position, text and completion, rejects duplicate IDs or a full destination, and does not erase unrelated newer reminders. Reload discards the undo opportunity, not the stored reminders.

Ticks express the visitor’s progress. They do not establish a reservation, inspected facility, accessibility guarantee or verified travel readiness. Summary counts separate personal reminders, unarranged ideas and saved IDs outside the current edition.

## Editorial questions and personal copies

[Canonical visitor questions](../research/destinations/visit-questions.json) contains six original questions for each of seven guides. Categories cover access, return travel, comfort, food, respectful encounters and alternatives. These are prompts to ask, not sourced answers or field reports. Each guide keeps them in an expandable notebook section.

The selected journey shows questions only for its saved catalogue identities. Adding a question copies its text into a personal reminder using a stable question ID. A subsequent attempt cannot overwrite a visitor’s edited wording or tick. A removed copy can be added again. Questions do not silently create reminders.

## Portable book selection and privacy

The reader chooses the whole journey, a numbered day, or Ideas for later. Selection produces a validated copy; it does not filter the saved original. A day copy keeps its day number and date. Its bounded title appends the day label. Trip-wide checklist marks and personal reminders remain available in that copy. Photo collection uses this same snapshot, so other days do not add photographs.

Turning off personal notes excludes item notes, day titles, day notes and the personal reminder list from HTML, text and print. Original public guide questions remain, even if their wording matches a copied reminder. Journey name, dates, saved choices and general preparation marks remain. JSON backups always retain the complete plan. A reminder-only journey can produce a book.

Changing journeys resets book scope to the whole journey. Removing the selected day also resets an invalid selection. Sharing preference is a page choice, not a persisted consent setting.

## Backup import choices

Independent import retains all validated source fields and adds a new journey. A collection backup exposes a source selector for importing just one journey. Full collection replacement is a separate disclosure with an acknowledgement checkbox.

Ideas-only merge preserves destination title, date, checklist, day notes, reminders and every existing idea. Duplicate idea IDs keep destination notes and day assignments. Previously absent ideas are appended under Ideas for later with their item notes. Source day notes, reminders, date and checklist are explicitly excluded in the preview; independent import preserves them. More than 100 combined ideas rejects the complete operation.

The preview records the destination ID and content fingerprint. A changed destination refreshes the preview and requires another deliberate click; it does not apply the obsolete preview. The existing storage comparison and cross-tab event block further mutations when another tab writes. This reduces stale overwrites; browser storage remains nontransactional.

## Compatibility and evidence

Older clients can discard optional fields they do not understand. Use the current site to restore newer backups. Existing ten-journey, import-size and browser-storage limits still apply; this change does not promise unlimited storage or server backup. Native printing remains separately unverified.

[Implementation and evidence](../research/product/ready-216.md) records the local candidate, test matrix and limitations. Code stays outside the KB in `projects/site`; these documents define its behavior and history.
