# Bit by Bit — Digital Logic Studio

[Open the study website](https://pablomarked.github.io/bit-by-bit-digital-logic/)

A responsive digital-logic study website with 30 guided lessons, 18 interactive visual walkthroughs, 72 practice questions with complete worked explanations, 15 solved Quiz #2 conversions, worked answer sheets, timed exams, and browser-local progress.

## Learn by watching and trying

Watch fractional place values fill a unit bar, carries and borrows move between columns, signals travel through logic gates, and XORs produce Gray-code bits. Every walkthrough has playback, manual steps, adjustable inputs, and an enlarged viewer. Full written explanations remain available in each lesson.

Topics include number-system fractions, binary arithmetic and complements, gates and truth tables, binary codes, Boolean algebra, and reflected Gray code.

## Local use

Open `index.html` in a current browser. Keep the other files alongside it. No installation, build command, API keys, server, or database is required.

## Deployment

GitHub Pages serves the `main` branch from `/(root)`. `.nojekyll` keeps the original static files intact. All asset URLs are relative and navigation uses URL fragments, so the repository-prefix URL works.

## Study progress

Each browser stores its own lesson completion, notes, and finished quiz results. Use **My progress → Export progress & notes** to back up or transfer them. The GitHub address uses separate browser storage from any earlier hosted copy; export there and import here to move saved progress.

## Content provenance

This is an independently written study edition organized around six digital-logic lecture titles. The original PowerPoints were unavailable during creation. Their slides, speaker notes, diagrams, examples, and professor answer keys have not yet been audited. The site clearly labels its independently supplied material and pending source review, and includes further-reading references.

## Complete worked solutions

[Browse all 72 examples](https://pablomarked.github.io/bit-by-bit-digital-logic/#examples) or [study Quiz #2](https://pablomarked.github.io/bit-by-bit-digital-logic/#quiz-2).

Every solution gives the method, each calculation or logic operation, intermediate results, tables, and checks. In guided practice, reveal one step at a time or open the entire walkthrough while keeping your answer editable. Exams show the same full solutions after grading. Printed keys include every worked step.

The Quiz #2 statements and submitted responses came from the student. The submitted responses are not treated as an instructor answer key. Independently verified explanations distinguish exact values, truncation, rounding, and radix-point formatting.

The adjustable number converter also provides a full exact calculation trace for any supported input.

## Validation

Run `npm test` with a current Node.js installation. The site itself needs no installation or build. Tests cover math answers, logic/code tables, the worked-solution data, and visual models.
