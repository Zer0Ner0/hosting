# Enhanced Responsive Pricing Cards

A comprehensive, fully responsive pricing cards component that matches the Hostinger design system exactly. This component can be used across all hosting-related pages with consistent styling and behavior.

## Features

- ✅ **Pixel-perfect design** matching the Figma specifications
- ✅ **Fully responsive** - works on mobile, tablet, and desktop
- ✅ **Customizable plans** - easy to configure for different pages
- ✅ **Accessibility compliant** with proper ARIA labels
- ✅ **TypeScript support** with full type definitions
- ✅ **Interactive features** - expandable feature lists, hover effects
- ✅ **Flexible styling** - customizable colors and spacing
- ✅ **Plan selection handling** - callback support for user actions

## Design System Colors

The component uses the official Hostinger color palette:

```css
--Branding-hostinger-Periwinkle: #D5DFFF
--Branding-hostinger-White: #FFF  
--Branding-hostinger-Meteorite: #2F1C6A
--Branding-hostinger-Storm-Gray: #727586
--Branding-hostinger-Royal-Blue: #673DE6
--Branding-hostinger-Malibu: #8C85FF
--Branding-hostinger-Zircon: #FAFBFF
```

## Basic Usage

```tsx
import EnhancedResponsivePricingCards, { defaultPlans } from '../components/hosting/EnhancedResponsivePricingCards';

function HostingPage() {
  return (
    <EnhancedResponsivePricingCards
      plans={defaultPlans}
      title="Web Hosting Plans"
      subtitle="Choose the perfect hosting plan for your needs"
    />
  );
}
```

## Advanced Usage

### Custom Plans

```tsx
import { type PricingPlan } from '../components/hosting/EnhancedResponsivePricingCards';

const customPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for small websites",
    originalPrice: "9.99",
    currentPrice: "2.99",
    savePercentage: "Save 70%",
    term: "For 24-month term",
    renewalPrice: "6.99",
    buttonVariant: "outline",
    buttonText: "Get Started",
    onSelectPlan: (planId) => {
      // Handle plan selection
      console.log('Selected:', planId);
    },
    features: [
      { 
        text: "5 websites", 
        included: true, 
        bold: "5",
        underlined: true 
      },
      { 
        text: "10 GB storage", 
        included: true, 
        bold: "10 GB" 
      },
      { 
        text: "Free SSL", 
        included: true, 
        bold: "Free",
        underlined: true 
      },
      { 
        text: "Priority support", 
        included: false 
      }
    ]
  }
];
```

### WordPress-Specific Plans

```tsx
const wordpressPlans: PricingPlan[] = [
  {
    id: "wp-starter",
    name: "WordPress Starter",
    description: "Optimized for WordPress websites",
    originalPrice: "12.99",
    currentPrice: "3.99",
    savePercentage: "Save 69%",
    term: "For 36-month term",
    renewalPrice: "8.99",
    buttonVariant: "filled",
    buttonText: "Start with WordPress",
    isPopular: true,
    features: [
      { text: "WordPress pre-installed", included: true, bold: "WordPress pre-installed" },
      { text: "Auto updates", included: true },
      { text: "WP staging tool", included: true, underlined: true },
      { text: "Advanced caching", included: true, bold: "Advanced" }
    ]
  }
];
```

### Email Hosting Plans

```tsx
const emailPlans: PricingPlan[] = [
  {
    id: "email-pro",
    name: "Email Professional", 
    description: "Professional email for your business",
    originalPrice: "4.99",
    currentPrice: "1.99",
    savePercentage: "Save 60%",
    term: "For 12-month term",
    renewalPrice: "3.99",
    buttonVariant: "outline",
    buttonText: "Get Email Hosting",
    features: [
      { text: "25 email accounts", included: true, bold: "25" },
      { text: "50 GB per account", included: true, bold: "50 GB" },
      { text: "Custom domain", included: true, bold: "Custom domain" },
      { text: "Mobile sync", included: true }
    ]
  }
];
```

## Props Reference

### EnhancedResponsivePricingCardsProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plans` | `PricingPlan[]` | required | Array of pricing plans to display |
| `title` | `string` | `undefined` | Optional main title above the cards |
| `subtitle` | `string` | `undefined` | Optional subtitle text |
| `className` | `string` | `''` | Additional CSS classes for the container |
| `showFeatureLimit` | `number` | `15` | Number of features to show before "See more" |

### PricingPlan Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the plan |
| `name` | `string` | ✅ | Plan name (e.g., "Premium") |
| `description` | `string` | ✅ | Short description of the plan |
| `originalPrice` | `string` | ✅ | Original price (crossed out) |
| `currentPrice` | `string` | ✅ | Current discounted price |
| `savePercentage` | `string` | ✅ | Savings text (e.g., "Save 75%") |
| `term` | `string` | ✅ | Billing term (e.g., "For 48-month term") |
| `renewalPrice` | `string` | ✅ | Price after renewal |
| `features` | `PricingFeature[]` | ✅ | Array of plan features |
| `isPopular` | `boolean` | ❌ | Shows "Most Popular" banner |
| `buttonVariant` | `'outline' \| 'filled'` | ✅ | Button style variant |
| `buttonText` | `string` | ❌ | Custom button text (default: "Choose plan") |
| `onSelectPlan` | `(planId: string) => void` | ❌ | Plan selection callback |

### PricingFeature Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `text` | `string` | ✅ | Feature description text |
| `included` | `boolean` | ✅ | Whether feature is included (affects icon and color) |
| `bold` | `string` | ❌ | Text portion to make bold |
| `underlined` | `boolean` | ❌ | Whether to underline the text |

## Responsive Behavior

The component automatically adapts to different screen sizes:

- **Mobile (< 768px)**: Single column layout, optimized spacing
- **Tablet (768px - 1280px)**: Two column grid  
- **Desktop (> 1280px)**: Three column grid, full feature display

## Accessibility

- Semantic HTML structure with proper headings
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast colors meeting WCAG guidelines
- Screen reader friendly feature lists

## Customization

### Styling

The component uses Tailwind CSS classes and can be customized via:

1. **CSS Custom Properties** - Override the color variables
2. **Tailwind Classes** - Pass custom `className` prop
3. **Component Props** - Configure behavior and content

### Custom Color Scheme

```css
.custom-pricing-cards {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --accent-color: #your-color;
}
```

### Feature Icons

The component includes built-in icons for:
- ✅ Included features (green checkmark)
- ➖ Excluded features (gray minus)

## Integration Examples

### Main Hosting Page

```tsx
<EnhancedResponsivePricingCards
  plans={hostingPlans}
  title="Web Hosting Plans"
  subtitle="Reliable hosting solutions for every need"
  className="py-16"
/>
```

### WordPress Page

```tsx
<EnhancedResponsivePricingCards
  plans={wordpressPlans}
  title="WordPress Hosting"
  subtitle="Optimized for WordPress performance"
  showFeatureLimit={10}
/>
```

### Email Hosting Page

```tsx
<EnhancedResponsivePricingCards
  plans={emailPlans}
  title="Professional Email"
  subtitle="Business email solutions"
  showFeatureLimit={8}
/>
```

## Best Practices

1. **Plan Ordering**: Place most popular plan in the center
2. **Feature Limits**: Use `showFeatureLimit` to avoid overwhelming users
3. **Button Actions**: Always provide `onSelectPlan` callback for user tracking
4. **Responsive Testing**: Test on various screen sizes
5. **Performance**: Use React.memo for static plan data
6. **Accessibility**: Test with screen readers and keyboard navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Guide

If you're migrating from other pricing card components:

1. Update import statements to use the new component
2. Restructure plan data to match the `PricingPlan` interface
3. Replace custom styling with the built-in responsive design
4. Test on all target devices and screen sizes

## Performance Considerations

- Component uses `useState` for feature expansion
- Icons are inlined SVGs for fast loading
- CSS-in-JS avoided in favor of Tailwind classes
- Minimal JavaScript bundle impact

## Troubleshooting

### Common Issues

**Plans not displaying correctly**
- Ensure all required properties are provided in plan objects
- Check that `features` array has valid `PricingFeature` objects

**Styling looks different**
- Verify Tailwind CSS is properly configured
- Check that DM Sans font is loaded
- Ensure no conflicting CSS is overriding the styles

**TypeScript errors**
- Import types: `import { type PricingPlan } from '...'`
- Ensure all plan objects match the interface exactly

**Responsive issues**
- Test with browser dev tools
- Check that container has proper max-width
- Verify Tailwind responsive classes are working
