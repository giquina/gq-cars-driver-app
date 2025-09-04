# GQ Cars Professional Driver App - PRD

## Core Purpose & Success
- **Mission Statement**: A mobile app that provides professional drivers with a clean, intuitive interface to manage rides, track earnings, and maintain their business operations with the polish and reliability of industry leaders like Freenow.
- **Success Indicators**: Drivers can complete core tasks in under 3 taps, feel confident using the app professionally, and have clear visibility into their earnings and performance.
- **Experience Qualities**: Professional, Intuitive, Trustworthy

## Project Classification & Approach
- **Complexity Level**: Light Application (multiple features with basic state)
- **Primary User Activity**: Acting (accepting rides, managing work status, tracking performance)

## Thought Process for Feature Selection
- **Core Problem Analysis**: Professional drivers need a reliable, easy-to-use interface that doesn't distract from driving while providing essential business management tools.
- **User Context**: Used throughout work shifts, often while driving, needs to be accessible with one hand and in various lighting conditions.
- **Critical Path**: Sign in → Go online → Accept rides → Track earnings → Go offline
- **Key Moments**: Welcome greeting, ride acceptance decision, earnings visibility, status changes

## Essential Features

### Authentication & Welcome
- Clean welcome screen with personalized greeting
- Profile photo display for user recognition
- Clear sign-in options including account switching

### Navigation System
- Bottom tab navigation with 5 core sections
- Home, Earnings, Schedule, Achievements, Menu
- Red accent color for active states matching Freenow aesthetic

### Earnings Dashboard
- Primary feature with Performance/Balance tabs
- Date range selector with week navigation
- Large, prominent earnings display
- Weekly calendar view with visual indicators

### Vehicle Management
- Vehicle selection and switching
- License plate display
- Last used vehicle prominence
- Clear confirmation flow

### Profile & Settings
- User profile access
- Menu system with categorized options
- Account management and sign out

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional confidence, clarity, trustworthiness
- **Design Personality**: Clean, business-appropriate, modern without being flashy
- **Visual Metaphors**: Professional dashboard, financial statements, business tools
- **Simplicity Spectrum**: Minimal interface with maximum clarity

### Color Strategy
- **Color Scheme Type**: Analogous with strategic accent
- **Primary Color**: Bright red/pink (#E91E63) - energetic, attention-grabbing for CTAs
- **Secondary Colors**: Clean whites and light grays for backgrounds and containers
- **Accent Color**: Green for positive actions (online status, earnings, success states)
- **Color Psychology**: Red conveys urgency and action, white suggests cleanliness and professionalism, green indicates success and "go"

### Typography System
- **Font Pairing Strategy**: Single modern sans-serif family (Inter) with multiple weights
- **Typographic Hierarchy**: Bold for earnings/important numbers, medium for headings, regular for body text
- **Font Personality**: Clean, technical, highly legible
- **Readability Focus**: Large touch targets, high contrast, mobile-optimized sizing
- **Which fonts**: Inter (already implemented) - excellent for professional apps
- **Legibility Check**: Inter provides excellent legibility at all sizes and weights

### Visual Hierarchy & Layout
- **Attention Direction**: Large earnings displays draw eye first, then navigation, then supporting details
- **White Space Philosophy**: Generous spacing creates calm, professional feel - less cluttered than consumer apps
- **Grid System**: Card-based layout with consistent padding and spacing
- **Responsive Approach**: Mobile-first with touch-optimized components
- **Content Density**: Lower density than consumer apps - easier scanning while driving

### Animations
- **Purposeful Meaning**: Subtle transitions that provide feedback without distraction
- **Hierarchy of Movement**: Status changes get animation priority, then navigation feedback
- **Contextual Appropriateness**: Minimal motion suitable for professional context and driving safety

### UI Elements & Component Selection
- **Component Usage**: Cards for information grouping, Tabs for section switching, prominent Buttons for actions
- **Component Customization**: Larger touch targets, rounded corners, professional color scheme
- **Component States**: Clear hover/pressed states, loading indicators, success feedback
- **Icon Selection**: Simple, universal icons (house, money, calendar, trophy, menu)
- **Component Hierarchy**: Primary red buttons, secondary gray buttons, tertiary text links
- **Spacing System**: Consistent 8px grid system for predictable spacing
- **Mobile Adaptation**: Bottom navigation, one-handed operation focus

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance minimum
- **Foreground/Background Pairings**: 
  - White text on red buttons (high contrast)
  - Dark gray text on white backgrounds
  - White text on dark gray cards
  - Green text on light backgrounds for success states

## Edge Cases & Problem Scenarios
- **Network connectivity issues**: Offline capability for core features
- **Driver distraction**: Large touch targets, minimal interaction required
- **Various lighting conditions**: High contrast design works in sunlight and darkness
- **One-handed operation**: Bottom navigation, reachable primary actions

## Implementation Considerations
- **Scalability Needs**: Component-based architecture for easy feature additions
- **Testing Focus**: Mobile usability, touch interaction, performance
- **Critical Questions**: How to maintain professional feel while being user-friendly for varying technical skills

## Reflection
This approach balances professional requirements with user-friendly design, taking inspiration from successful apps like Freenow while meeting specific needs of professional drivers. The focus on clarity and minimal distraction makes it suitable for use while driving, while the professional aesthetic builds trust with business users.