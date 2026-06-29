# ASIF TRADERS - Building Materials E-Commerce Website

A complete, production-ready e-commerce website for ASIF TRADERS, a building materials trading business in Navi Mumbai, Maharashtra.

## Features

### Core Functionality
- **Product Catalog**: Browse 9 categories of building materials with filters and variant selectors
- **Cart System**: Add products, adjust quantities, manage your cart
- **Two Checkout Flows**: Standard checkout and bulk quote request (RFQ)
- **OTP Authentication**: Mobile-based login with OTP verification
- **Delivery Area Check**: Pincode-based serviceability check for Navi Mumbai and Thane areas
- **Order Management**: Track quote requests and order history

### Product Categories
1. Cement (OPC 43/53, PPC, PSC, White Cement)
2. TMT Bars (6mm to 32mm variants)
3. Structural Steel (Angles, Channels, Plates, etc.)
4. GI Pipes
5. MS Pipes
6. Tiles (Vitrified, Ceramic, Elevation, etc.)
7. AAC Blocks (Various sizes)
8. Cement Sheets & Roofing
9. Sand & Aggregate

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **State Management**: React Context + localStorage persistence

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd asif-traders

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory if you need to configure:

```env
# SMS OTP Provider (future integration)
OTP_PROVIDER=msg91
OTP_API_KEY=your-api-key

# Payment Gateway (future integration)
RAZORPAY_KEY=your-razorpay-key

# Google Maps (future integration)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-maps-key
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── cart/
│   ├── categories/
│   ├── category/[slug]/
│   ├── checkout/
│   ├── contact/
│   ├── delivery/
│   ├── login/
│   ├── orders/
│   ├── product/[slug]/
│   ├── profile/
│   ├── quote/
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BottomNav.tsx
│   ├── LocationModal.tsx
│   ├── ToastContainer.tsx
│   └── Providers.tsx
├── context/                # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── LocationContext.tsx
│   └── ToastContext.tsx
└── data/
    └── products.ts         # Product catalog data
```

## Demo Credentials

For testing OTP login:
- **Phone**: Any 10-digit number
- **OTP**: `123456`

## Business Information

**ASIF TRADERS**
- Location: Digha, Thane-Belapur Road, Navi Mumbai, Maharashtra
- Phone: +91 79775 72727
- WhatsApp: +91 79775 72727

**Serviceable Areas**
- Navi Mumbai: Digha, Airoli, Rabale, Ghansoli, Kopar Khairane, Vashi, Sanpada, Nerul, Seawoods, Turbhe
- Thane: Mahape, Kalwa, Thane, Naupada, Majiwada, Mumbra, Dombivli, Kalyan

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Deploy with default settings

### Other Platforms

```bash
npm run build
# Upload the .next folder and start with:
npm start
```

## Features by Page

| Page | Features |
|------|----------|
| Home | Hero carousel, category grid, product carousels, testimonials |
| Categories | All 9 categories with icons |
| Category | Subcategory filtering, product grid with variants |
| Product | Size selector, quantity stepper, add to cart, bulk quote |
| Cart | Item management, quantity adjusters, price summary |
| Checkout | Address form, payment selection, order confirmation |
| Quote | Multi-item form, contact details, GSTIN field |
| Orders | Quote request history with status tracker |
| Profile | User info, saved addresses, GSTIN |
| Contact | Contact form, Google Maps, click-to-call/WhatsApp |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved by ASIF TRADERS
