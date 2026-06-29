# ASIF TRADERS - E-Commerce Website Specification

## 1. Concept & Vision

ASIF TRADERS is a professional building materials trading platform designed for contractors, masons, architects, and individual home builders in the Navi Mumbai/Thane region. The site conveys **trustworthiness and reliability** — a no-nonsense supplier you can depend on for cement, steel, pipes, tiles, and more at wholesale prices. The experience should feel like walking into a well-organized, reputable materials depot: efficient, clear, and focused on getting the job done.

The visual language draws from the raw beauty of construction materials themselves — terracotta bricks, weathered sandstone, sturdy steel beams — creating a distinctive aesthetic that immediately communicates the industry without resorting to generic "construction site" clichés.

## 2. Design Language

### Aesthetic Direction
**Industrial Warmth** — The robust, honest aesthetic of a premium hardware depot. Think exposed brick walls in a modern showroom, the satisfying geometry of steel beams, and the earthy warmth of sandstone. Professional but not sterile.

### Color Palette
- **Primary (Terracotta)**: `#B6452C` — Evokes brick and construction materials
- **Primary Dark**: `#8C3420` — Hover/active states
- **Accent (Safety Amber)**: `#F2A93B` — CTAs, discount badges, attention-grabbers
- **Secondary (Steel Blue)**: `#3D5A73` — Trust badges, info chips, secondary actions
- **Background (Sandstone)**: `#F4EDE4` — Section breaks, cards
- **Surface (Warm White)**: `#FDFBF8` — Main page background
- **Text Primary**: `#2B2B2E` — Charcoal/graphite for readability
- **Text Secondary**: `#6B6B70` — Muted text
- **Success**: `#2D7D46` — Stock available, delivery confirmed
- **Error**: `#C41E3A` — Validation errors, out of stock

### Typography
- **Headings**: `Barlow Condensed` (600, 700) — Sturdy, slightly condensed sans-serif with industrial character
- **Body**: `Inter` (400, 500, 600) — Clean, highly readable for specifications and prices
- **Monospace accents**: `JetBrains Mono` — For prices, quantities, codes

### Spatial System
- Base unit: 4px
- Component padding: 16px (mobile), 24px (desktop)
- Card border-radius: 12px
- Button border-radius: 8px
- Section spacing: 48px (mobile), 80px (desktop)

### Motion Philosophy
- **Micro-interactions**: 150ms ease-out for hovers, button presses
- **Page transitions**: 200ms fade for route changes
- **Carousels**: 300ms ease-in-out slide animations
- **Modals**: 250ms scale + fade entrance
- **Staggered reveals**: 50ms delay between list items on scroll

### Visual Assets
- **Icons**: Lucide React — consistent 24px stroke icons
- **Product Images**: Unsplash construction/materials photos + CSS gradients as fallbacks
- **Decorative**: Subtle diagonal stripe patterns for headers, geometric beam shapes
- **Logo**: Custom SVG "A" mark formed by overlapping beam shapes + wordmark

## 3. Layout & Structure

### Page Structure
1. **Sticky Header** (64px): Logo left, search center, actions right
2. **Location Chip** (48px): Delivery area indicator under header
3. **Main Content**: Full-width with max-width 1280px container
4. **Bottom Tab Bar** (mobile only, 64px): 5 primary navigation tabs
5. **Footer**: Full-width with contact, links, map

### Responsive Strategy
- **Mobile (< 768px)**: Single column, bottom tab bar, stacked cards
- **Tablet (768px - 1024px)**: 2-column grids, sidebar filters
- **Desktop (> 1024px)**: 3-4 column grids, persistent sidebar filters, no bottom bar

### Visual Pacing
- Hero: Full-bleed, dramatic imagery with text overlay
- Categories: Breathing room with generous spacing between cards
- Products: Denser grid for quick scanning
- CTAs: Isolated with whitespace to draw attention

## 4. Features & Interactions

### Navigation
- **Hamburger drawer**: Home, Categories, My Orders, Offers, About, Contact, Login/Logout
- **Search**: Animated placeholder cycling + keyboard shortcut Cmd/Ctrl+K
- **Cart indicator**: Badge count with pulse animation on add

### Delivery Location Gate
- **First visit modal**: Dismissable after selection
- **Pincode input**: Numeric validation against serviceable list
- **Persistence**: localStorage with 7-day expiry
- **UI**: City chip under search bar + delivery ETA badge

### Product Browsing
- **Category grid**: 9 large tappable cards with hover lift
- **Sub-category listing**: Filterable cards with size variant selector
- **Product detail**: Gallery, price, specs table, related products
- **Quick actions**: Add to cart, bulk quote request

### Cart & Checkout
- **Cart drawer**: Slide-in with quantity adjusters
- **Two flows**: Standard checkout (small orders) + Quote request (bulk)
- **Quote flow**: Multi-item form → confirmation → saved in orders

### Authentication
- **OTP login**: +91 prefix, 6-digit code, resend timer
- **Mock mode**: Accepts 123456 for testing
- **Session**: localStorage with 30-day expiry

### Order Management
- **Order history**: Cards with status tracker
- **Quote requests**: Pending → Quoted → Confirmed → Delivered
- **Status visualization**: Progress stepper

## 5. Component Inventory

### Header
- Logo with wordmark
- Hamburger menu (mobile) / Nav links (desktop)
- Search bar with voice icon
- Cart icon with badge
- User avatar/login button

### Location Chip
- Pin icon + city name
- Dropdown to change location
- Delivery ETA badge

### Category Card
- Image/icon background
- Category name overlay
- Product count badge
- Hover: slight lift + shadow

### Product Card
- Product image
- Title + variant info
- Price with MRP strikethrough
- Discount badge
- Stock indicator
- Add button

### Bottom Tab Bar
- 5 tabs: Home, Categories, Quote/Cart, Orders, Profile
- Active state with icon fill
- Badge for cart count

### Modal/Drawer
- Backdrop blur
- Slide-in from right (cart) or center (confirmations)
- Close button + click-outside dismiss

### Form Components
- Text input with floating label
- Phone input with +91 prefix
- OTP input (6 boxes)
- Quantity stepper (+/-)
- Pincode validator

### Buttons
- Primary: Solid terracotta fill
- Secondary: Steel-blue outline
- Ghost: Text only with underline hover
- Disabled: 50% opacity, no pointer events

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom config
- **State**: React Context + localStorage persistence
- **Icons**: Lucide React

### Data Model
```typescript
interface Product {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  name: string;
  variants: Variant[];
  description: string;
  specifications: Record<string, string>;
  images: string[];
  inStock: boolean;
  minOrderQty: number;
  unit: 'bag' | 'ton' | 'piece' | 'sqft' | 'running_ft' | 'per_brass' | 'per_truck';
}

interface Variant {
  size: string;
  grade?: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
}

interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
}

interface QuoteRequest {
  id: string;
  items: CartItem[];
  status: 'pending' | 'quoted' | 'confirmed' | 'delivered';
  createdAt: string;
  total: number;
}
```

### API Routes (Future)
- `/api/products` — Product catalog
- `/api/orders` — Order management
- `/api/auth/otp` — OTP generation/verification
- `/api/quotes` — Quote requests
- `/api/delivery/check` — Pincode serviceability

### Routes
- `/` — Home
- `/category/[category]` — Category listing
- `/category/[category]/[subcategory]` — Subcategory listing
- `/product/[slug]` — Product detail
- `/cart` — Cart page
- `/checkout` — Checkout flow
- `/quote` — Quote request form
- `/orders` — Order history
- `/login` — OTP login
- `/profile` — User profile
- `/about` — About us
- `/contact` — Contact page
- `/delivery` — Delivery area check
- `/404` — Not found

### Serviceable Pincodes (Navi Mumbai/Thane)
- 400708 (Digha/Airoli)
- 400701 (Rabale)
- 400710 (Ghansoli)
- 400709 (Kopar Khairane)
- 400705 (Vashi)
- 400703 (Sanpada)
- 400703 (Nerul)
- 400706 (Seawoods)
- 400614 (Mahape)
- 400705 (Turbhe)
- 400605 (Kalwa)
- 400601 (Thane)
- 400602 (Naupada)
- 400604 (Majiwada)
