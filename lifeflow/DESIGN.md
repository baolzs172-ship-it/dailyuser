---
name: LifeFlow
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c7c5d0'
  on-secondary: '#303038'
  secondary-container: '#494851'
  on-secondary-container: '#b9b7c2'
  tertiary: '#c8c5cb'
  on-tertiary: '#303034'
  tertiary-container: '#a4a2a8'
  on-tertiary-container: '#39393d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e4e1ed'
  secondary-fixed-dim: '#c7c5d0'
  on-secondary-fixed: '#1b1b23'
  on-secondary-fixed-variant: '#46464f'
  tertiary-fixed: '#e4e1e7'
  tertiary-fixed-dim: '#c8c5cb'
  on-tertiary-fixed: '#1b1b1f'
  on-tertiary-fixed-variant: '#47464b'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
  section-gap: 2rem
---

## Brand & Style
The design system is centered on a high-end, high-contrast aesthetic tailored for personal performance and financial tracking. It leverages a deep, obsidian-like foundation to allow content and data visualizations to "pop" with maximum clarity. The target audience values precision, speed, and a premium digital experience that feels more like a native productivity tool than a standard website.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**. By stripping away unnecessary decorative elements and focusing on a strict color palette, the UI maintains a professional and focused atmosphere. Glassmorphism is used strategically for transient layers (like modals and overlays) to maintain a sense of context and depth within the dark environment, preventing the interface from feeling flat or claustrophobic.

## Colors
The palette is dominated by the "Deep Obsidian" background (#0B0B0F), which ensures perfect black levels on OLED mobile screens. Surfaces and cards utilize "Midnight Slate" (#16161E) to create subtle separation from the background without relying on heavy borders. 

"Emerald Green" (#10B981) serves as the primary action color, signifying growth, health, and positive financial flow. This same color is utilized for "Success" states to maintain a streamlined mental model. For "Danger" or negative expenditure, "Rose Red" (#EF4444) provides a sharp, high-contrast warning. Typography relies on pure white for primary information and "Steel Grey" (#94A3B8) for secondary metadata and de-emphasized labels.

## Typography
The system uses a multi-font approach to balance personality with technical precision. **Manrope** is used for headlines to provide a modern, refined, and slightly tech-forward feel. **Inter** is the workhorse for body text, chosen for its exceptional legibility and systematic appearance at small sizes. **Geist** is employed for labels and data points to provide a clean, developer-centric aesthetic that feels precise and organized.

For the mobile-first 375px width, headlines are kept tight with negative letter spacing to ensure maximum impact without excessive wrapping. Secondary text always utilizes the #94A3B8 color to maintain clear visual hierarchy.

## Layout & Spacing
This design system follows a **fluid grid** model optimized for the narrow viewport of mobile web browsers. A standard 4-column grid is used for internal card layouts, while the primary container maintains a 16px (1rem) safe-area margin on the left and right edges.

Spacing follows an 8px incremental scale (4, 8, 16, 24, 32). Elements within a card should use `stack-sm` (8px) for related items and `stack-md` (16px) for distinct groups. Components should never touch the edge of the screen; the 16px `container-margin` is a hard requirement for all views.

## Elevation & Depth
In this dark environment, elevation is communicated through **Tonal Layers** and **Glassmorphism**, rather than traditional shadows which are often lost on dark backgrounds.

1.  **Level 0 (Base):** #0B0B0F.
2.  **Level 1 (Cards):** #16161E with a 1px subtle stroke of white at 5% opacity to define edges.
3.  **Level 2 (Modals/Toasts):** A translucent layer (e.g., #16161E at 80% alpha) with a 20px backdrop-filter blur. This creates a "glass" effect that allows the underlying colors of the app to peek through.
4.  **Interaction:** When an element is pressed, it should slightly scale down (98%) rather than rely on a shadow change, providing a tactile, physical response.

## Shapes
The design system utilizes a "Rounded-2XL" language for its primary containers to evoke a friendly yet premium feel. Standard UI elements (Buttons, Inputs) use the default `rounded-lg` (16px) radius. Larger containers, such as Dashboard Cards and Modals, use a consistent 24px (1.5rem) radius. Small utility elements like Tags or Chips use a full pill-shape to distinguish them from interactive buttons.

## Components
-   **Buttons:** Primary buttons are solid Emerald (#10B981) with black text for maximum contrast. Secondary buttons use a ghost style with a 1px stroke of #94A3B8.
-   **Cards:** Use #16161E background with 24px corner radius. Padding within cards is fixed at 20px.
-   **Input Fields:** Darker than the card background (#0B0B0F) to create an "inset" look. Focus states must use a 2px Emerald stroke.
-   **Toast Notifications:** Positioned at the top of the viewport. Use a high-density glassmorphism effect (80% blur) with a leading icon colored by status (Success/Danger).
-   **Modals:** Bottom-sheet style for mobile, sliding up from the base. They must feature a "grabber" handle at the top and use the signature 20px backdrop blur.
-   **Chips/Tags:** Used for categories. These are small, pill-shaped, and use a 10% opacity version of the Primary color for the background with solid Emerald text.