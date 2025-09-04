# GQ Cars Driver Management App

A comprehensive driver management system for taxi/ride-sharing services that allows tracking driver performance, earnings, and operational metrics.

**Experience Qualities**: 
1. Professional - Clean, business-focused interface that instills confidence in fleet management
2. Efficient - Quick access to critical driver information and metrics without unnecessary complexity  
3. Insightful - Clear data visualization that enables informed decision-making about driver performance

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected features for driver management, earnings tracking, and performance monitoring with persistent data storage

## Essential Features

### Driver Registration & Profile Management
- **Functionality**: Add, edit, and view driver profiles with personal information, license details, and vehicle assignment
- **Purpose**: Maintain accurate driver records for regulatory compliance and fleet management
- **Trigger**: Admin clicks "Add Driver" or selects existing driver from list
- **Progression**: Form entry → validation → save to database → confirmation → return to driver list
- **Success criteria**: Driver information persists, can be retrieved and modified, validation prevents invalid data

### Earnings & Trip Tracking
- **Functionality**: Record and track driver earnings, trip counts, and financial metrics over time
- **Purpose**: Monitor driver performance and calculate compensation accurately
- **Trigger**: Manual entry of trip data or automatic sync from ride completion
- **Progression**: Trip completion → earnings calculation → database update → dashboard refresh
- **Success criteria**: Accurate earnings calculation, historical data retention, real-time dashboard updates

### Performance Dashboard
- **Functionality**: Visual overview of key metrics including total drivers, active drivers, earnings summaries, and performance trends
- **Purpose**: Provide at-a-glance insights for fleet management decisions
- **Trigger**: App loads or user navigates to dashboard
- **Progression**: Data fetch → metric calculation → chart rendering → display key insights
- **Success criteria**: Charts load quickly, data is accurate and up-to-date, responsive design works on all devices

### Driver Status Management
- **Functionality**: Track and update driver availability status (active, inactive, suspended)
- **Purpose**: Manage fleet capacity and driver assignments effectively
- **Trigger**: Admin updates driver status or automated status changes based on activity
- **Progression**: Status change request → validation → database update → notification → UI refresh
- **Success criteria**: Status changes are immediate, reflected across all views, maintain audit trail

## Edge Case Handling

- **Empty States**: Show helpful prompts when no drivers are registered yet
- **Data Validation**: Prevent invalid driver information entry with clear error messages
- **Network Issues**: Graceful handling of connectivity problems with retry mechanisms
- **Duplicate Records**: Prevent duplicate driver registrations through validation checks
- **Data Export**: Allow exporting driver and earnings data for external reporting

## Design Direction

The design should feel professional and efficient, similar to enterprise fleet management software with a modern twist - clean lines, organized data presentation, and intuitive navigation that prioritizes functionality over flashy aesthetics.

## Color Selection

Complementary (opposite colors) - Using a professional blue and warm orange combination to create trust (blue) while highlighting important actions and metrics (orange).

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 230)) - Communicates trust, reliability, and professionalism
- **Secondary Colors**: Light Gray (oklch(0.95 0.01 230)) for backgrounds, Medium Gray (oklch(0.7 0.02 230)) for secondary text
- **Accent Color**: Warm Orange (oklch(0.65 0.15 45)) - Attention-grabbing highlight for CTAs, earnings, and important metrics
- **Foreground/Background Pairings**: 
  - Background (Light Gray #F8F9FA): Dark Blue text (oklch(0.25 0.1 230)) - Ratio 12.5:1 ✓
  - Card (White #FFFFFF): Dark Blue text (oklch(0.25 0.1 230)) - Ratio 14.2:1 ✓  
  - Primary (Deep Blue): White text (oklch(0.98 0.01 230)) - Ratio 8.9:1 ✓
  - Accent (Warm Orange): White text (oklch(0.98 0.01 45)) - Ratio 5.1:1 ✓

## Font Selection

Inter font family to convey modern professionalism with excellent readability across all screen sizes - essential for data-heavy interfaces where clarity is paramount.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - H3 (Card Titles): Inter Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Captions: Inter Regular/14px/normal spacing
  - Data Labels: Inter Medium/14px/tight spacing

## Animations

Subtle and functional animations that enhance workflow efficiency without distraction - smooth transitions between states, gentle hover effects on interactive elements, and satisfying micro-interactions for completed actions.

- **Purposeful Meaning**: Smooth card hover states reinforce interactivity, loading states show progress, success animations provide positive feedback
- **Hierarchy of Movement**: Primary actions get subtle scale effects, data updates use gentle fade transitions, navigation uses smooth slide animations

## Component Selection

- **Components**: 
  - Cards for driver profiles and metric displays with subtle shadows
  - Tables for driver listings with sorting capabilities  
  - Forms with validation using Input, Label, and Button components
  - Charts using recharts for earnings and performance visualization
  - Dialogs for driver registration and editing
  - Badges for driver status indicators
  - Tabs for organizing different data views

- **Customizations**: 
  - Custom metric cards with icon integration
  - Enhanced table with search and filter capabilities
  - Custom chart components for driver-specific analytics

- **States**: 
  - Buttons: Subtle hover scale, active press state, disabled opacity
  - Cards: Gentle hover elevation, selected state highlighting
  - Inputs: Focus ring in primary color, error states in red, success states in green

- **Icon Selection**: Phosphor icons for consistency - User for drivers, Car for vehicles, CurrencyDollar for earnings, ChartLine for analytics

- **Spacing**: Consistent 4px base unit - 16px for card padding, 24px for section gaps, 8px for form element spacing

- **Mobile**: Stack cards vertically, collapse table to card views, hamburger navigation, larger touch targets (48px minimum), responsive typography scaling