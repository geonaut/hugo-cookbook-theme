# Hugo Cookbook Theme

A clean, [Material Design 3](https://m3.material.io/) cookbook theme for Hugo. Built for recipe collections, food writing, and culinary blogs.

![Screenshot](https://raw.githubusercontent.com/geonaut/hugo-cookbook-theme/main/images/screenshot.png)

**Features:**
- Recipe index with course/cuisine filtering
- Homepage carousel of featured recipes
- Banner images with gradient overlay on recipe and post pages
- Image galleries with lightbox
- Palette system — switch between Forest, Ocean, and Spice colour schemes, or set your own primary and tertiary colours
- Dark mode via `prefers-color-scheme`
- Print-optimised recipe layout
- Shortcodes for ingredients, instructions, hints, and galleries
- Responsive, mobile-first layout
- Material Symbols icons
- i18n-ready

---

## Requirements

- Hugo **0.146.0** or later (non-extended)
- Go **1.23** or later (for Hugo Modules)

---

## Installation

Add the theme to your site as a Hugo Module. In your site's `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/geonaut/hugo-cookbook-theme"
```

Then run:

```sh
hugo mod get github.com/geonaut/hugo-cookbook-theme
```

---

## Quick Start

Copy the `exampleSite/` directory as a starting point:

```sh
cp -r themes/hugo-cookbook-theme/exampleSite/* .
hugo server
```

---

## Content Structure

```
content/
├── recipes/
│   ├── _index.md          # Recipes section page
│   ├── mains/
│   │   ├── _index.md
│   │   └── my-dish/
│   │       ├── index.md   # Recipe (page bundle)
│   │       ├── banner.jpg # Hero image
│   │       └── photo.jpg  # Gallery images
│   ├── starters/
│   ├── desserts/
│   └── sauces/
├── writing/               # Food writing / essays
├── about.md
└── contact.md
```

Recipes use **page bundles** so images live alongside the content file.

### Recipe front matter

```yaml
---
title: "Miso-Glazed Salmon"
date: 2024-11-12
description: "A short description shown in cards and meta tags."
categories: ["Mains"]      # Used for grouping on the index
tags: ["Japanese", "Seafood", "Healthy"]
featured: true             # Appears in the homepage carousel
banner: "banner.jpg"       # Hero image (page bundle resource)
thumbnail: "thumb.jpg"     # Optional separate thumbnail for cards
---
```

`categories` drives the recipe index grouping and the Course filter.  
`tags` that match entries in `data/flags.toml` appear as cuisine flags (emoji) and populate the Cuisine filter.

---

## Configuration

Full example in [`exampleSite/hugo.toml`](exampleSite/hugo.toml). Key options:

```toml
[params]
  homeEyebrow = "Welcome to"        # Small text above the homepage title

  # Section names — change if your content uses different directory names
  recipesSection = "recipes"
  writingSection = "writing"

  # Colour palette: "forest" (default) | "ocean" | "spice"
  palette = "forest"

  # Override individual colours within any palette
  [params.colors]
    primary  = "#1b4332"
    tertiary = "#9d0208"

  # Font overrides (must be loaded via params.fonts.url or params.fonts.selfHosted)
  [params.fonts]
    sans       = "Inter"
    serif      = "Lora"
    url        = ""        # Custom Google Fonts URL
    iconsUrl   = ""        # Custom Material Symbols URL
    selfHosted = false     # Set true to skip loading Google Fonts

  # Featured cards shown at the bottom of the homepage
  [[params.utilityCards]]
    title       = "PDF Cookbook"
    description = "Download the collection as a printable PDF."
    url         = "/pdf-cookbook"
    icon        = "picture_as_pdf"   # Material Symbol name
    color       = "primary"          # "primary" or "tertiary"
```

### Navigation menu

Menu items support an `icon` param (Material Symbol name):

```toml
[[menus.main]]
  name    = "Recipes"
  pageRef = "/recipes"
  weight  = 10
  [menus.main.params]
    icon = "menu_book"
```

Sections with subsections automatically get a dropdown showing up to 5 pages per subsection.

### Output formats

The theme ships a print layout. Enable it in `hugo.toml`:

```toml
[outputs]
  page = ["HTML", "print"]

[outputFormats.print]
  name      = "print"
  baseName  = "index"
  isHTML    = true
  mediaType = "text/html"
  path      = "print"
```

---

## Colour Palettes

Three built-in palettes live in `data/palettes/`:

| Palette | Primary | Character |
|---------|---------|-----------|
| `forest` (default) | Deep green | Earthy, botanical |
| `ocean` | Navy blue | Clean, coastal |
| `spice` | Burnt orange | Warm, Mediterranean |

Set `params.palette = "ocean"` to switch. Dark mode colours come directly from the palette data — accurate Material Design 3 tonal values for both schemes.

To use entirely custom colours without a named palette, set `params.colors.primary` and/or `params.colors.tertiary`. Dark mode values are approximated via `color-mix()`.

---

## Shortcodes

### `recipe-grid`

Two-column layout for ingredients and instructions:

```markdown
{{</* recipe-grid */>}}
  {{</* ingredients */>}}
  - 2 salmon fillets
  - 3 tbsp white miso
  {{</* /ingredients */>}}

  {{</* instructions */>}}
  1. Mix glaze ingredients.
  2. Brush over salmon and grill for 8 minutes.
  {{</* /instructions */>}}
{{</* /recipe-grid */>}}
```

### `hints`

Tips section with an optional custom title:

```markdown
{{</* hints title="Make ahead" */>}}
The glaze can be made up to 3 days in advance and kept refrigerated.
{{</* /hints */>}}
```

### `gallery`

Image gallery with lightbox. Images are page bundle resources:

```markdown
{{</* gallery layout="horizontal" */>}}
photo-1.jpg
photo-2.jpg
photo-3.jpg
{{</* /gallery */>}}
```

`layout` accepts `horizontal` or `vertical`.

### `sc`

Renders text in small-caps:

```markdown
{{</* sc */>}}serves 4{{</* /sc */>}}
```

---

## Flags (Cuisine Emoji)

`data/flags.toml` maps tag names to country flag emoji. Tags that match an entry are shown as flags in recipe cards and on the recipe page, and populate the Cuisine filter on the recipes index.

To add a cuisine, add an entry to `data/flags.toml` in your site's `data/` directory (Hugo merges data files):

```toml
Korean = "🇰🇷"
```

---

## Customising Head

Add custom `<head>` content (analytics, additional styles, extra meta tags) by creating:

```
layouts/_partials/head/extra.html
```

in your site's layouts directory.

---

## Self-Hosting Fonts

Set `params.fonts.selfHosted = true` to prevent the theme loading Google Fonts. Supply your own `@font-face` declarations via `layouts/_partials/head/extra.html` and set `params.fonts.sans` / `params.fonts.serif` to match.

---

## License

MIT — see [LICENSE](LICENSE).
