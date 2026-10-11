# Design

The site should feel like a calm, well-set page, not a template. Dark,
minimal, warm, with very little text.

## Rules (please keep them)

1. **One accent colour.** Warm amber `--color-accent: #f2a541`. Use it
   sparingly: section numbers, the dot after the name, hover states,
   milestones. **No purple, no blue-to-purple gradients, no neon.**
2. **No bento / card grids, no glassmorphism cards.** Layout is editorial:
   single column, hairline dividers (`border-line`), generous whitespace,
   left-aligned.
3. **Short copy.** Headlines ≤ 6 words, summaries one sentence. If it needs a
   paragraph, it doesn't belong on the page.
4. **Type does the heavy lifting.** Big tight display type for the name and the
   contact heading. Small uppercase mono labels for meta (`01 — Work`).
5. **Motion is subtle.** Things rise a little and fade in, once. Nothing loops,
   nothing follows the cursor, nothing bounces. Easing: `--ease-out-soft`.
6. **Accessible by default.** Contrast ≥ 4.5:1 for text (axe checks it in
   CI), visible focus rings (amber outline), reduced motion respected.

## Tokens (`src/app/globals.css` → `@theme`)

| Token         | Value     | Use                                    |
| ------------- | --------- | -------------------------------------- |
| `bg`          | `#0b0b0a` | page background (warm near-black)      |
| `surface`     | `#141412` | screenshot frames                      |
| `raised`      | `#1c1c19` | frame title bar                        |
| `line`        | fg @ 9%   | hairline dividers, borders             |
| `line-strong` | fg @ 18%  | hover borders, button outlines         |
| `fg`          | `#ecebe4` | primary text (warm off-white)          |
| `muted`       | `#adaba2` | secondary text                         |
| `faint`       | `#8a8880` | labels, meta (lowest allowed contrast) |
| `accent`      | `#f2a541` | the one accent                         |

Fonts: **Space Grotesk** (`font-sans`) for everything, **JetBrains Mono**
(`font-mono`) for small labels, tags and the fake address bar.

Container: `max-w-6xl` with `px-5 md:px-8`. Sections: `py-24 md:py-36`,
separated by `border-t border-line`.

## Screenshots

The screenshots are old, bright and come in different sizes. `ProjectShot` makes
them fit in:

- A minimal **browser frame** (grey dots + mono address bar) makes them look
  like they belong there.
- Fixed **16:9 aspect**, `object-cover object-top`: any size crops the same way.
- **Muted by default**: `grayscale(.9) brightness(.52)`, plus an amber
  `mix-blend-color` tint at 10%. Bright white UIs turn into soft warm grey.
- **Bottom fade** into the frame colour.
- **Hover/focus on the row** brings back full colour and a 2.5% zoom.
- Touch devices (`hover: none`) get a middle setting, since they can't hover.

Swapping in sharper screenshots later needs no layout changes.

## Motion inventory

| Where       | What                                               |
| ----------- | -------------------------------------------------- |
| Hero        | lines rise out of a mask, staggered 0–640ms        |
| Sections    | `<Reveal>` fade + 20px rise on first view          |
| Screenshots | colour + zoom on hover (700–900ms)                 |
| Links/icons | arrow nudges, colour transitions                   |
| Header      | transparent → blurred background after 24px scroll |
