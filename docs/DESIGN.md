# Design

A dark, typographic, poster-like page. Few words, set very large.
It should feel calm and deliberate, not like a template.

## Rules (please keep them)

1. **One accent.** Saffron `#f4a73b`. Use it for the hero's middle line,
   section numbers, periods, active states and hover. **No purple, no
   blue-to-purple gradients, no neon, no glassmorphism cards.**
2. **No bento or card grids.** Editorial layout: hairline dividers, big type,
   generous space, left-aligned.
3. **Hierarchy is flipped.** The statement is huge and the name is a small mono
   label. Section labels are small mono rows (`01  SELECTED WORK ———`).
   Project titles, roles and tools are set in big condensed caps.
4. **Short copy.** Hero lines ≤ 16 chars, summaries ≤ 90, highlights ≤ 70.
   Unit tests enforce this.
5. **Minimum sizes.** Mono labels are 13px or larger, body text 16px or larger.
6. **Motion has a purpose and plays once.** Nothing bounces, and nothing loops
   except the sound bars while audio plays.
7. **Hover and scroll effects never change layout.** Animate transforms,
   opacity, colour or background position only. `tests/e2e` checks that hovering
   headings doesn't change any size.
8. **Accessible.** Contrast ≥ 4.5:1 (axe checks it), focus rings visible,
   reduced motion respected everywhere.

## Type

| Role            | Font                     | Notes                                                        |
| --------------- | ------------------------ | ------------------------------------------------------------ |
| Display / body  | **Bricolage Grotesque**  | Variable: weight 200–800, width 75–100, optical size 12–96   |
| Labels / meta   | **Martian Mono**         | Wide mono, good contrast with the condensed display face     |

Utilities in `globals.css`:

- `condensed` (utility): width 75, weight 700, tight tracking. Used for headlines.
- `<StretchText>` (component): widens from width 75 to 100 on hover. An
  invisible full-width copy reserves the space, so **hovering never reflows
  the layout**. Use it only for short single-line text (it never wraps).
  Never animate `font-variation-settings` width on wrapping text: wider glyphs
  push words onto new lines and shove the page around. An e2e test guards this.

## Tokens (`@theme` in `src/app/globals.css`)

| Token         | Value       | Use                                   |
| ------------- | ----------- | ------------------------------------- |
| `bg`          | `#0b0b0a`   | page (warm near-black)                |
| `surface`     | `#131311`   | terminal, image placeholder           |
| `raised`      | `#1b1b18`   | dock                                  |
| `line`        | fg @ 10%    | hairlines                             |
| `line-strong` | fg @ 20%    | outlines, label rules                 |
| `fg`          | `#ecebe4`   | text                                  |
| `muted`       | `#adaba2`   | secondary text                        |
| `faint`       | `#8a8880`   | meta (lowest allowed contrast)        |
| `accent`      | `#f4a73b`   | the one accent                        |
| `sand`        | `#d4c3a1`   | duotone highlight colour              |

## Screenshots: duotone + lens

The screenshots are old, bright and inconsistent. They're treated as prints:

- **Duotone** (`.duotone`): the image is greyscaled and multiplied over
  `sand`, then a `lighten` layer lifts black to the page colour. Every
  screenshot maps from page-black to sand, so they all match.
- **Scroll reveal**: `LensImage` animates `clip-path` from an inset rounded
  rectangle to full bleed, with a ±6% parallax drift inside.
- **Colour lens**: a 170px circle follows the mouse and shows the real
  colours (a second copy of the image clipped with
  `circle(var(--lens-r) at var(--x) var(--y))`; `--lens-r` is a registered
  `@property`, so the radius animates). Tapping on touch screens toggles full colour.
- **Archive previews**: `ArchiveList` shows a tilted, full-colour thumbnail that
  trails the cursor on a spring. Desktop only.
- Projects with no screenshot use a built-in visual (`RagTerminal`).

Better screenshots can be dropped in later without any layout change.

## Motion inventory

| Where           | What                                                           | How                    |
| --------------- | -------------------------------------------------------------- | ---------------------- |
| Hero lines      | rise from a mask while settling wide/light → condensed/bold    | CSS `settle` keyframes |
| Hero stats      | count up (3.2s counts *down* to 1.2s)                          | `CountUp` (rAF)        |
| Section labels  | hairline draws in                                              | `.draw-line` + Reveal  |
| Blocks          | fade + rise on first view                                      | `Reveal`               |
| Screenshots     | clip-path open + parallax + colour lens                        | motion `useScroll`     |
| Archive         | spring-follow preview, arrow rotates                           | motion springs         |
| Terminal        | types out once in view                                         | `RagTerminal`          |
| Dock            | slides up after the hero; active pill slides between links     | CSS + motion `layoutId`|
| Hero (scroll)   | lines shear apart in alternating directions and fade           | `HeroHeadline`         |
| Project titles  | ink in left → right as they scroll up                          | `ScrollFillText`       |
| Career          | timeline line fills with a glowing head                        | `ScrollProgressLine`   |
| Stack           | rows drift sideways in alternating directions                  | `DriftRow`             |
| Contact         | heading grows into place; widens on hover (no reflow)          | `ScaleIn`, `StretchText` |
| Career titles   | colour shift on hover                                          | CSS                    |
| Dock            | page-progress hairline along its bottom edge                   | motion `useScroll`     |
| Page            | inertial smooth scroll                                         | Lenis                  |

## Sound

`lib/ambient.ts` synthesises the music live with Web Audio: a detuned
A/E drone through a slowly breathing low-pass filter, plus random A-minor
pentatonic chimes every 3–8s through a generated reverb. Master volume is
0.07. It's off by default and starts only on click (browsers block
autoplay). It fades in and out, and pauses while the tab is hidden. Toggles
in the top bar and dock share state through `lib/sound-store.ts`.
