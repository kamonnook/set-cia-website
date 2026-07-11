# Infographics

Generated infographics for the SET-CIA website live here. Each one is a single
self-contained `.svg` file — it needs no other files, so you can also open it in
a browser, download it, print it, or post it to social media.

## Naming
`NN-short-name.svg` — numbered so they sort newest-last, e.g.
`01-network-at-a-glance.svg`, `02-mou-2025.svg`.

## How they reach the website
Each infographic is shown as a card on `pages/impact.html`. To add a new one,
Claude appends a `<figure class="infographic">` block there pointing at the new
SVG — or just ask Claude to "add it to the Impact page".

## Editing the numbers yourself
The SVG is plain text. Open it in any text editor, find the number you want to
change (e.g. `40+`), edit it, save. No tools required. (Ask Claude if a layout
shifts.)
