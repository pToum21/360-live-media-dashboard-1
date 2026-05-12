# 360 Live Media Brand Implementation

This dashboard follows the 360 Live Media brand guidelines.

## Brand Colors (Applied)

- **360 Green** (`#2E8741`) - Primary brand color
- **Forest Green** (`#103d27`) - Dark backgrounds
- **Spring Leaf** (`#84BE41`) - CTA buttons and "more" emphasis
- **Rich Green Black** (`#0C1C14`) - Text color

## Typography

The brand uses **Neue Haas Grotesk** as the primary typeface. 

### Current Implementation
We're using system fonts (Helvetica Neue, Segoe UI, Arial) as a fallback that closely match Neue Haas Grotesk's clean, modern aesthetic.

### To Add the Official Font (Optional)

If you have access to Neue Haas Grotesk:

1. Add the font files to `public/fonts/`
2. Update `app/globals.css`:

```css
@font-face {
  font-family: 'Neue Haas Grotesk';
  src: url('/fonts/NeueHaasGroteskText-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Neue Haas Grotesk';
  src: url('/fonts/NeueHaasGroteskText-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

3. Update the `body` font-family:
```css
body {
  font-family: 'Neue Haas Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Design Principles Applied

✅ **Rounded corners** - Cards use 0.75rem border radius  
✅ **Green gradient backgrounds** - Forest Green to 360 Green  
✅ **"More" emphasis** - Spring Leaf color highlights key value props  
✅ **Clean, modern aesthetic** - Sans-serif typography, generous spacing  
✅ **Professional with personality** - Bold headlines, dynamic gradients  

## Brand Resources

- Style Guide: [360 Live Media Brand Kit](https://cast-ribbon-chalk.figma.site/)
- Logo files: Available from brand kit
- Full color palette and usage guidelines in brand documentation

---

**Note:** This dashboard is an internal tool for 360 Live Media marketers. All branding should align with the official style guide.
