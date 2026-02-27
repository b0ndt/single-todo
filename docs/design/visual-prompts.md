# Visual Asset Prompts — single-todo

> Every pixel tells the story. These prompts generate the raster assets that complete the brand.

**Pipeline:** NanoBanana (Gemini 3.1 Flash)
**Format:** Each `## heading` is one asset. The pipeline parses `prompt:`, `size:`, and `output:` fields.

---

## logo-mark

prompt: "Clean vector-style logo mark on a solid deep black background (#0A0A0F). A single filled circle in vibrant neon cyan (#00F0FF) with a debossed checkmark carved into its surface, enclosed in a rounded square frame with subtle brushed metal edge highlights. The checkmark is a negative-space cut revealing the dark background beneath, as if stamped into polished metal. A soft cyan neon glow radiates outward from the circle. Cinematic top-left lighting at 145 degrees creates subtle highlights on the upper-left edges and shadows on the lower-right. Minimal, precise, no text, no extra decoration. The mark conveys singular focus and quiet confidence."
size: "1:1"
output: "public/logo.png"

---

## favicon

prompt: "Minimal favicon icon on solid deep black background (#0A0A0F). A single small neon cyan (#00F0FF) filled circle with a thin debossed checkmark cut into it. No frame, no border, no text. The circle has a soft outer glow halo in cyan. Pixel-perfect at small sizes, clear silhouette, ultra-simple. Clean vector style, centered composition."
size: "1:1"
output: "public/favicon.png"

---

## og-image-social

prompt: "Social media Open Graph card, 1200x630 resolution. Deep black background (#0A0A0F) with an extremely subtle brushed-metal texture overlay at 3 percent opacity — fine diagonal lines running at 145 degrees. On the left third, the single-todo logo mark: a neon cyan (#00F0FF) filled circle with a debossed checkmark, enclosed in a rounded square frame, rendered at approximately 200px diameter with a prominent layered cyan glow halo (soft inner glow, medium mid glow, wide outer glow fading to transparent). To the right of the logo, the text 'single-todo' in clean geometric sans-serif, weight 500, color #E8E8F0, letter-spacing slightly expanded. Below that, the tagline 'One thing. Done right.' in smaller text, color #8888A0. A very faint cinematic light gradient sweeps from the top-left to bottom-right at 145 degrees, adding depth. The overall mood is premium, dark, focused, like a control room interface at night."
size: "16:9"
output: "public/og-image.png"

---

## hero-empty-state

prompt: "Abstract hero illustration for a dark productivity app. A single luminous orb floating in vast deep black space (#0A0A0F). The orb is neon cyan (#00F0FF), semi-transparent with an inner radial gradient that is brighter at the upper-left (catching cinematic light from 145 degrees) and fading to transparent at the edges. The orb casts a soft downward glow onto a reflective floor plane below it — the floor has an extremely subtle brushed-metal texture at 5 percent opacity. 4 to 6 tiny particle motes drift slowly around the orb, rendered as small dots in very faint cyan (#00F0FF at 25 percent opacity). The mood is calm, meditative, singular — one object in infinite space. No text, no UI elements. Cinematic depth of field with the orb in sharp focus and the background softly blurred."
size: "4:3"
output: "docs/design/mockups/hero-empty-state.png"

---

## mockup-empty-state

prompt: "UI mockup screenshot of a dark minimal todo application in empty state. Deep black background (#0A0A0F) with subtle radial gradient vignette. Centered vertically: at top, a small neon cyan logo mark (circle with checkmark). Below it, a glowing translucent orb floating with a soft reflection beneath it. Below the orb, large bold white headline text reading 'What needs doing?' with a subtle debossed text shadow effect. Below that, smaller gray supporting text 'One thing at a time. Add your focus.' Below that, a dark input field with rounded corners, inset shadow giving a debossed carved-into-metal feel, with faint placeholder text 'Your one thing...' and a neon cyan arrow button on the right edge. Below the input, a tiny right-aligned character counter. The entire composition sits in a narrow centered column (480px max). The aesthetic is neo-skeuomorphic cinematic: brushed metal textures, neon accents, dramatic 145-degree lighting. Dark mode only. Premium, minimal, Awwwards-quality."
size: "9:16"
output: "docs/design/mockups/empty-state.png"

---

## mockup-active-todo

prompt: "UI mockup screenshot of a dark minimal todo application showing an active todo. Deep black background (#0A0A0F). Centered: a card panel with brushed-metal surface texture (very subtle diagonal grain lines at 145 degrees), slightly raised with a soft shadow falling to the bottom-right. The card has a thin border with the top-left edge slightly lighter (catching light) and bottom-right edge darker. Inside the card: at the top, a tiny embossed uppercase label 'YOUR FOCUS' in muted gray that looks stamped into the metal surface. Below it, large bold white text reading 'Send the revised proposal to Aya by 3pm' with a debossed text shadow. Below that, a small timestamp 'Added 5 min ago' with a tiny clock icon, in muted gray. At the bottom of the card, two side-by-side buttons: a 'Done' button with green (#00FF88) text and subtle green glow border, and a 'Drop it' button in muted gray. Above the card, a small neon cyan logo. Neo-skeuomorphic cinematic aesthetic, 145-degree cinematic lighting, dark mode. Premium quality."
size: "9:16"
output: "docs/design/mockups/active-todo.png"

---

## mockup-confirm-delete

prompt: "UI mockup screenshot of a dark minimal todo application showing a delete confirmation dialog. Deep black background. Behind a semi-transparent dark overlay with subtle blur, a dimmed and blurred todo card is visible. In the center foreground, a frosted glass dialog card with backdrop blur effect, rounded corners (24px radius), floating with a dramatic shadow. The glass card has a faint white border on the top edge catching light from 145 degrees. Inside the dialog: centered headline text 'Let this one go?' in bold white with debossed shadow, supporting text 'It won't be marked as done.' in muted gray. Two buttons side by side: 'Keep it' with neon cyan (#00F0FF) text and subtle cyan glow, and 'Yes, drop it' in muted gray (turns red on hover). The dialog floats dramatically above the darkened background. Frosted glass, cinematic lighting, neo-skeuomorphic. Ultra-premium dark UI."
size: "9:16"
output: "docs/design/mockups/confirm-delete.png"

---

## mockup-mobile-empty

prompt: "Mobile phone mockup showing a dark minimal todo app in empty state. The phone screen displays a deep black UI with a floating neon cyan orb at center, a bold headline 'What needs doing?' below it, and a dark debossed input field at the bottom. The phone frame is a modern edge-to-edge smartphone silhouette. The screen has the neo-skeuomorphic cinematic aesthetic: brushed metal textures, neon cyan accents, dramatic lighting from 145 degrees. The background outside the phone is solid deep black. Clean, premium, showcasing the mobile-first responsive design."
size: "3:4"
output: "docs/design/mockups/mobile-empty.png"

---

## mockup-mobile-active

prompt: "Mobile phone mockup showing a dark minimal todo app with an active todo card. The phone screen displays a brushed-metal card with embossed label 'YOUR FOCUS', bold text 'Buy oat milk', timestamp 'Added just now', and two action buttons — green 'Done' and muted 'Drop it' stacked vertically. Small neon cyan logo at top. Deep black background (#0A0A0F). The card has cinematic 145-degree lighting with top-left highlight and bottom-right shadow. The phone is a modern edge-to-edge device frame. Premium dark UI aesthetic."
size: "3:4"
output: "docs/design/mockups/mobile-active.png"

---

## texture-brushed-metal

prompt: "Seamless tileable texture of brushed metal surface. Very dark gunmetal gray (#12121A) base color. Extremely subtle directional grain lines running diagonally at 145 degrees, barely visible at 2-3 percent brightness above the base. The texture should tile seamlessly when repeated. No scratches, no reflections, just the finest directional grain. Photorealistic brushed aluminum look but extremely dark and muted. Suitable as a background texture at low opacity."
size: "1:1"
output: "docs/design/textures/brushed-metal.png"

---

## hero-banner-wide

prompt: "Ultra-wide cinematic hero banner for a dark productivity web application. Deep black void (#0A0A0F) stretching to infinity. At center, a single luminous neon cyan (#00F0FF) orb with soft layered glow halos — the glow fades through multiple rings outward. Below the orb, a reflective dark floor surface with a faint pool of cyan light. The composition is horizontally centered with vast negative space on both sides. 4-6 tiny particle motes scatter around the orb at varying distances. A very faint cinematic light gradient sweeps from top-left at 145 degrees. The mood is: a single point of focus in an infinite dark universe. Minimal, cinematic, breathtaking. No text, no UI. Think Christopher Nolan meets Dieter Rams."
size: "21:9"
output: "docs/design/mockups/hero-banner-wide.png"

---

## component-buttons-showcase

prompt: "Design showcase of button components on deep black background. Four rows of buttons displayed horizontally. Row 1: a neon cyan outlined button labeled 'Lock it in' with soft cyan glow. Row 2: a green outlined button labeled 'Done' with subtle green glow. Row 3: a muted gray button labeled 'Drop it' with no glow in default state. Row 4: the same 'Drop it' button but in hover state with red glow and red text. Each button has a dark raised surface background (#1A1A2E), rounded corners (8px), and is displayed in default, hover, and pressed states left to right. The pressed state shows an inset shadow effect. Neo-skeuomorphic cinematic style. Design system documentation quality."
size: "16:9"
output: "docs/design/mockups/buttons-showcase.png"

---

## component-input-showcase

prompt: "Design showcase of a text input component on deep black background (#0A0A0F). Three states shown vertically: Default state — dark debossed input field with inset shadow, faint border, placeholder text 'Your one thing...' in muted gray, neon cyan arrow button on right edge. Focused state — same input but with a bright neon cyan glow ring surrounding it, brighter border, text cursor visible in cyan. Error state — same input but with a red glow ring, red border, and small red error text below reading 'Your todo needs some words.' Each state is clearly labeled. The inputs have a carved-into-metal debossed appearance with brushed metal surface behind. Clean component documentation layout."
size: "16:9"
output: "docs/design/mockups/input-showcase.png"

---

## app-icon-ios

prompt: "iOS app icon design on solid deep black background. A rounded square (iOS icon shape with smooth superellipse corners) filled with deep black (#0A0A0F). In the center, a neon cyan (#00F0FF) filled circle with a carved checkmark in negative space. The circle has a soft neon glow halo. A subtle brushed metal texture overlay at 3 percent opacity covers the entire icon surface. Cinematic 145-degree lighting creates a faint highlight on the upper-left corner of the rounded square. Clean vector style, no text, premium quality, recognizable at small sizes."
size: "1:1"
output: "public/app-icon.png"

---

## color-palette-reference

prompt: "Design reference card showing a color palette for a dark cinematic UI. On a deep black background, display color swatches arranged in a clean grid. Primary row: Deep Black (#0A0A0F), Surface (#12121A), Raised Surface (#1A1A2E), Hover (#222240). Accent row: Neon Cyan (#00F0FF) with a visible glow effect around the swatch. Semantic row: Success Green (#00FF88), Danger Red (#FF3366), Warning Amber (#FFB800). Text row: Primary White (#E8E8F0), Secondary Gray (#8888A0), Disabled (#4A4A60). Each swatch is a rounded rectangle with the hex code displayed below in small monospace text. The overall layout is clean and systematic, suitable for design system documentation."
size: "16:9"
output: "docs/design/mockups/color-palette.png"

---

## Handoff

| Artifact | Path | Status |
|----------|------|--------|
| Visual Prompts (this file) | `docs/design/visual-prompts.md` | ✅ Complete |

### Pipeline Instructions

1. Each `## heading` above is one asset to generate.
2. Parse the `prompt:`, `size:`, and `output:` fields.
3. Generate using NanoBanana (Gemini 3.1 Flash) with the given prompt and aspect ratio.
4. Save to the specified `output:` path.
5. Ensure `public/` assets are committed to the repo.
6. Mockup images in `docs/design/mockups/` are for design reference only — they do not ship in the production bundle.

### Notes

- All prompts reference the brand color `#00F0FF` (Neon Cyan) and background `#0A0A0F` (Deep Black).
- The 145-degree cinematic lighting angle is referenced throughout for consistency.
- Logo prompts specify "no text" — the wordmark is rendered in code, not as a raster asset.
- Mockup prompts describe the actual UI to set visual expectations for the engineer.
- The `texture-brushed-metal` asset is optional — the CSS `repeating-linear-gradient` in the design system achieves the same effect in code.
