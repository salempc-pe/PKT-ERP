# Design System Specification: Editorial Precision ERP

## 1. Overview & Creative North Star
### The Creative North Star: "The Fluid Architect"
Most ERP systems feel like digital filing cabinets—rigid, cold, and claustrophobic. This design system rejects the "spreadsheet-as-an-interface" philosophy. Our North Star is **The Fluid Architect**: an experience that feels like a high-end architectural portfolio. It combines the structural integrity required for complex data with the airy, breathing room of a luxury editorial layout.

We break the "template" look by utilizing **intentional asymmetry** and **tonal depth**. Large-scale typography creates an authoritative hierarchy, while overlapping "glass" containers and staggered card layouts prevent the interface from feeling like a repetitive grid. We aren't just displaying data; we are curating a professional workspace.

---

## 2. Colors & Tonal Architecture
The palette transitions from a professional **Primary Blue (#0050d4)** to a vibrant **Tertiary Mint (#006947)**, creating a "Vibrant Professionalism" that feels fresh yet trustworthy.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be achieved through background shifts.
*   **The Technique:** Use a `surface-container-low` (#eef0ff) section sitting on a `surface` (#f6f6ff) background to define areas. This creates a "soft edge" that feels integrated into the environment rather than boxed in.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper.
*   **Level 0 (Base):** `surface` (#f6f6ff) - The canvas.
*   **Level 1 (Sections):** `surface-container-low` (#eef0ff) - For grouping large content areas.
*   **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff) - Reserved for the most important data points to provide maximum "pop."
*   **Level 3 (Overlays):** `surface-bright` (#f6f6ff) - Used for floating elements to maintain crispness.

### The "Glass & Gradient" Rule
To escape the "flat" look of standard ERPs, main CTAs and Hero backgrounds should utilize a subtle linear gradient: `primary` (#0050d4) to `primary-container` (#7b9cff) at a 135-degree angle. For floating navigation or sidebars, use **Glassmorphism**: `surface-container` at 80% opacity with a `24px` backdrop blur.

---

## 3. Typography
We use a dual-font strategy to balance character with legibility. 

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create clear entry points in complex dashboards. This font carries the "Editorial" weight.
*   **Body & Labels (Inter):** The workhorse. Inter’s high x-height ensures that even `label-sm` (0.6875rem) remains legible in dense data tables.

**Hierarchy Strategy:** Never use more than three font sizes on a single screen. Use `on-surface-variant` (#535b71) for secondary info to ensure the `primary` content remains the undisputed hero.

---

## 4. Elevation & Depth
### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of a shadow, place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#eef0ff) background. This creates a natural "lift" that is easy on the eyes during 8-hour workdays.

### Ambient Shadows
When an element must float (e.g., a Modal or a Popover), use an **Ambient Shadow**:
*   **Blur:** 32px to 64px.
*   **Opacity:** 4% - 6%.
*   **Color:** Use a tinted version of `on-surface` (#272e42). Avoid pure black/grey shadows; the tint ensures the shadow feels like a natural extension of the UI.

### The "Ghost Border" Fallback
If accessibility requirements demand a border (e.g., in high-density forms), use the **Ghost Border**:
*   **Token:** `outline-variant` (#a5adc6).
*   **Opacity:** 15%.
*   **Rule:** 100% opaque borders are strictly forbidden.

---

## 5. Components
### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`. Corner radius: `md` (0.75rem).
*   **Secondary:** `secondary-container` (#cdcdff) background with `on-secondary-container` (#2f2ebf) text. No border.
*   **Tertiary:** Transparent background with `primary` text. Use for low-emphasis actions.

### Cards & Data Lists
*   **Rule:** Forbid divider lines. Use `spacing-6` (1.5rem) of vertical white space or a subtle shift to `surface-container-high` (#d9e2ff) on hover to separate items.
*   **Radius:** Always use `lg` (1rem) for cards to maintain the "friendly yet professional" feel.

### Input Fields
*   **State:** Default state uses `surface-container-highest` (#d1dcff) as a solid background.
*   **Focus:** Transition to a `ghost-border` of `primary` with a soft `4px` outer glow (4% opacity).
*   **Shape:** `md` (0.75rem) roundedness to match buttons.

### Additional Signature Component: The "Contextual HUD"
A floating, glassmorphic bar (80% opacity `surface-container-lowest`) that appears at the bottom of the screen when multiple items are selected in an ERP list, using `tertiary-fixed` (#69f6b8) for success-related actions.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `tertiary` (#006947) sparingly for "Success" states and positive growth metrics to provide a refreshing "Mint" accent.
*   **Do** lean into white space. If a layout feels cramped, increase the padding from `4` (1rem) to `8` (2rem).
*   **Do** use `primary-dim` (#0046bb) for hover states on primary buttons to provide a tactile sense of depth.

### Don’t
*   **Don’t** use pure black (#000000) for text. Always use `on-surface` (#272e42) to keep the contrast high but the "vibe" soft.
*   **Don’t** use shadows on every card. Reserve shadows for elements that physically move or "pop" over the main content (Modals, Tooltips, Dropdowns).
*   **Don’t** use "Alert Red" for non-critical errors. Use the `error-container` (#fb5151) for a more sophisticated, less jarring warning.