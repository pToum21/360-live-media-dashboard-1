# Font Setup Instructions

This folder should contain the **Neue Haas Grotesk Display Pro** font files in WOFF2 format.

## Required Font Files:

Place the following font files in this directory:

1. `NeueHaasDisplayPro-Thin.woff2` (weight: 100)
2. `NeueHaasDisplayPro-Light.woff2` (weight: 300)
3. `NeueHaasDisplayPro-Regular.woff2` (weight: 400)
4. `NeueHaasDisplayPro-Medium.woff2` (weight: 500)
5. `NeueHaasDisplayPro-Bold.woff2` (weight: 700)
6. `NeueHaasDisplayPro-Black.woff2` (weight: 900)

## Where to Get the Font:

- **Option 1:** If you have a license, download from the font provider
- **Option 2:** Convert TTF/OTF files to WOFF2 using: https://cloudconvert.com/woff2-converter
- **Option 3:** Use a web font service like Adobe Fonts or Monotype if you have a subscription

## After Adding Files:

1. Restart your development server (`npm run dev`)
2. The font should automatically load across the entire site

## Fallback:

If the font files are not available, the site will use system fonts as a fallback:
- system-ui
- -apple-system
- sans-serif
