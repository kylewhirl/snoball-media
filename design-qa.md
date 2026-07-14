# Design QA

## Comparison targets

- Source visual truth:
  - `/Users/Kyle/snoball-media/.codex-reference-mobile-menu.png`
  - `/Users/Kyle/snoball-media/.codex-reference-services.png`
- Rendered implementation:
  - `/Users/Kyle/snoball-media/.codex-implementation-mobile-menu.png`
  - `/Users/Kyle/snoball-media/.codex-implementation-services-stack.png`
  - `/Users/Kyle/snoball-media/.codex-implementation-mobile-header-pill.png`
  - `/Users/Kyle/snoball-media/.codex-implementation-mobile-theme-selector.png`
  - `/Users/Kyle/snoball-media/.codex-implementation-calendar-modal.png`
- Combined comparison evidence:
  - `/Users/Kyle/snoball-media/.codex-mobile-menu-comparison.jpg`
  - `/Users/Kyle/snoball-media/.codex-services-stack-comparison.jpg`
- Viewports and states:
  - Mobile menu open at 390 × 844.
  - Desktop service stack with Service 06 pinned at 1280 × 720. The 1440 × 900 reference was normalized to the same 16:9 comparison frame.

## Full-view comparison evidence

- The mobile implementation preserves the reference's full-screen blue navigation surface, persistent brand/header controls, vertically centered primary navigation, and anchored lower action area. The requested icon control replaces the reference's text button.
- The service implementation matches the reference's sticky-card behavior: every prior panel remains visible as a narrow rounded tab while the active card covers the stack. Service 06 reaches its final 172px sticky offset with all five previous cards visible above it.

## Focused region comparison evidence

- Mobile header and navigation: the 48px icon target, circular reveal origin, staggered link entry, dividers, contact details, theme control, and project action were inspected at full readable scale in the combined mobile comparison.
- Service stack top edge: the reference and implementation were compared together to verify card radius, overlapping tab rhythm, nav clearance, active-card scale, and the final card's pinned position.

## Required fidelity surfaces

- Fonts and typography: passed. Snoball's existing Aristotelica display face remains intact. Navigation hierarchy, line height, weights, and wrapping are legible with no clipping at 390px.
- Spacing and layout rhythm: passed. Mobile controls remain within the safe frame with 48px tap targets. Desktop cards pin at 112px through 172px in 12px steps and retain consistent rounded tabs.
- Colors and visual tokens: passed. The implementation intentionally translates the source's palette into Snoball sky blue, icy blue, black, and white; no navy or purple was introduced.
- Image quality and asset fidelity: passed. No new raster assets were required. Existing Snoball logo and project/video assets remain unchanged.
- Copy and content: passed. The mobile menu uses the site's existing section names and adds concise, relevant descriptions plus the existing contact address.
- Icons: passed. Menu, close, theme, and arrow controls use the existing Lucide icon family with consistent stroke and optical size.
- Accessibility and interaction states: passed. The menu uses semantic navigation and dialog roles, `aria-expanded`, Escape-to-close, body scroll locking, reduced-motion handling, visible focus treatment, a keyboard focus loop, and closes after anchor navigation.
- Responsive behavior: passed at 390 × 844, 1117 × 734, and 1280 × 720 with no horizontal overflow.

## Comparison history

1. P2 — Mobile navigation was four cramped links below the header.
   - Fix: replaced the row with one hamburger icon and a full-screen circular-reveal menu; moved theme/contact actions into the overlay.
   - Post-fix evidence: `.codex-mobile-menu-comparison.jpg`; menu occupies 390 × 844 with no overflow and closes after navigating to `#services`.
2. P2 — The first sticky-card implementation constrained each card inside its own short wrapper, so cards released instead of accumulating.
   - Fix: made all six sticky cards direct siblings in one shared stack container with increasing top offsets and z-index.
   - Post-fix evidence: `.codex-services-stack-comparison.jpg`; Services 01–05 remain visible behind the active card.
3. P2 — Service 06 reached the stack but released immediately because trailing padding was outside the sticky content boundary.
   - Fix: replaced padding with a real 55vh spacer child inside the common stack container.
   - Post-fix evidence: Service 06 holds at top 172px and bottom 668px while the Process section remains below the viewport.
4. P2 — The mobile footer sat too close to the local development badge and lower edge.
   - Fix: increased the menu's lower breathing room, which also aligned the primary links more closely with the reference.
   - Post-fix evidence: final combined mobile comparison shows clear separation and no content collision.
5. P1 — The sticky site header rendered above the booking overlay.
   - Fix: raised the shared dialog overlay to z-index 100 and dialog content to 110, above the header at 70.
   - Post-fix evidence: `.codex-implementation-calendar-modal.png`; the calendar iframe is the topmost element at the header coordinates.
6. P2 — The mobile logo and menu button floated separately without a unified header surface.
   - Fix: grouped them in a 350 × 56 rounded translucent surface with a 24px backdrop blur, border, and restrained shadow.
   - Post-fix evidence: `.codex-implementation-mobile-header-pill.png` at 390 × 844.
7. P1 — The mobile theme selector opened behind the full-screen navigation and the first-visit default was forced to light.
   - Fix: moved the selector portal above the navigation layer, converted the choices to an explicit radio group, and changed the provider default to `system`.
   - Post-fix evidence: `.codex-implementation-mobile-theme-selector.png`; Light changed the root to `light`, then System restored the root to `dark` because the test system reports dark preference.
8. P2 — The email input visually collapsed to 37px while the submit button remained 56px.
   - Fix: removed mobile column-axis flex growth and applied an explicit 56px height/min-height to both controls.
   - Post-fix evidence: both controls measure 56px with matching top and bottom coordinates at 1117 × 734; both also measure 56px at 390 × 844.

## Verification

- Mobile menu open/close and Services anchor navigation tested in the in-app browser.
- Body scroll lock restores after menu navigation.
- Desktop Service 06 sticky coordinates verified after continued scrolling.
- Calendar modal layering verified at 390 × 844: overlay z-index 100, content 110, header 70.
- Mobile Light and System theme choices tested; System resolved to the operating system's dark preference.
- Mobile header pill measured at 350 × 56 with 24px backdrop blur.
- Email input and submit button measured at the same 56px height on mobile and desktop.
- TypeScript check passed.
- Production build passed.
- No visible runtime error overlay remained after the local preview cache was rebuilt.

## Findings

No actionable P0, P1, or P2 findings remain for this interaction pass.

## Follow-up polish

- P3: the menu description column can be removed later if an even more editorial, minimal mobile treatment is preferred.

## Desktop header regression — 2026-07-14

- Source visual truth: `/var/folders/5p/s780ctq539b22bl8x2vxhjhm0000gn/T/TemporaryItems/NSIRD_screencaptureui_JqPTXF/Screenshot 2026-07-14 at 11.51.58 AM.png`.
- Rendered implementation: `/Users/Kyle/.codex/visualizations/2026/07/14/019f61f8-d386-7ff1-8a50-f55d376863fa/snoball-header-fixed.png`.
- Theme-menu state: `/Users/Kyle/.codex/visualizations/2026/07/14/019f61f8-d386-7ff1-8a50-f55d376863fa/snoball-header-fixed-theme-menu.png`.
- Combined focused comparison: `/Users/Kyle/.codex/visualizations/2026/07/14/019f61f8-d386-7ff1-8a50-f55d376863fa/snoball-header-comparison.png`.
- Viewport and state: desktop at 2048 × 746, page top, system theme; theme dropdown also checked open. Mobile regression check at 390 × 844, menu closed.
- Full-view evidence: the centered primary navigation remains centered while the brand occupies the left edge and the project/theme controls occupy the right edge of the same container.
- Focused-region evidence: measured desktop bounds place the brand at x=344–511, nav at x=837–1211, project arrow at x=1616–1660, and theme trigger at x=1668–1704. The open theme menu ends at x=1704, aligned to its trigger rather than appearing beside the brand.
- Fonts and typography: unchanged from the source implementation; no text sizing, wrapping, or font tokens were modified.
- Spacing and layout rhythm: passed. Restoring desktop `justify-between` on the persistent parent creates the intended left/center/right distribution with no overlap.
- Colors and visual tokens: unchanged and passed in both system/light render evidence.
- Image quality and asset fidelity: unchanged; the existing Snoball logo and hero project imagery remain intact.
- Copy and content: unchanged.
- Comparison history: P1 desktop controls were grouped immediately after the logo because `md:contents` removed the child wrapper's `justify-between`. The fix moved desktop distribution to the parent container. Post-fix browser evidence and bounds confirm the correction.
- Responsive verification: at 390 × 844 the desktop nav and project controls remain hidden and the mobile menu button remains visible.
- Interaction verification: the theme dropdown opens from the right-side trigger and contains Light, Dark, and System choices. No browser console errors were recorded.
- Build verification: `pnpm build` passed.
- Findings: no actionable P0, P1, or P2 issues remain for this regression.

## Appearance dropdown refinement — 2026-07-14

- Source visual truth: `/var/folders/5p/s780ctq539b22bl8x2vxhjhm0000gn/T/TemporaryItems/NSIRD_screencaptureui_kbf3uK/Screenshot 2026-07-14 at 11.56.13 AM.png`.
- Desktop implementation: `/Users/Kyle/.codex/visualizations/2026/07/14/019f61f8-d386-7ff1-8a50-f55d376863fa/snoball-theme-menu-desktop-fixed.png` at 2048 × 746.
- Mobile implementation: `/Users/Kyle/.codex/visualizations/2026/07/14/019f61f8-d386-7ff1-8a50-f55d376863fa/snoball-theme-menu-mobile-fixed.png` at 390 × 844 with the navigation and appearance menus open.
- Full-view evidence: desktop keeps the panel aligned to the right edge of its trigger; mobile opens the panel above and to the right of the trigger with a 12px viewport inset, without covering the contact details.
- Focused-region evidence: all three options use equal 36px rows with a 16px selection slot, an 8px gap, a centered 16px icon slot, and an 8px label gap. The panel is 176px wide with 8px internal padding.
- Fonts and typography: passed. The label uses the site's small uppercase utility style and option labels remain 14px with consistent baselines.
- Spacing and layout rhythm: passed. Icon, selection indicator, and label columns align consistently; selected background fills the row without touching the panel edge.
- Colors and visual tokens: passed. The selected row uses the existing primary token at low opacity; light/dark/system icon colors inherit the foreground token.
- Image quality and asset fidelity: passed. Existing Lucide icons remain crisp SVG assets; no raster replacements or placeholders were introduced.
- Copy and content: unchanged and passed.
- Comparison history: P2 options had no gap between icon and label and the absolute radio indicator produced an uneven left gutter. The rows now use a three-column grid. P2 mobile positioning overlapped the contact copy; the mobile instance now opens top/start with collision padding.
- Interaction and responsive verification: Light, Dark, and System remain semantic radio menu items. Desktop and mobile menus opened successfully and recorded no console errors.
- TypeScript and production build verification: passed.
- Findings: no actionable P0, P1, or P2 issues remain for the appearance dropdown.

final result: passed
