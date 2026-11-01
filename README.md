# TICKETORA — Your Journey, Our Priority.
> **Secondary Tagline**: Book Easy. Travel Smart.  
> **Target Market**: Bangladesh (Currency: BDT ৳, Timezone: Asia/Dhaka)  
> **Platform**: Complete Bus Ticket Booking, Bus Counter POS, Operator Fleet Management & Transportation Administration Platform.

---

## 🚌 Overview

**TICKETORA** is a full-stack, enterprise-grade transportation management ecosystem engineered to bridge the gap between online web passengers and physical bus counter terminals using **one centralized, real-time seat inventory system**.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Supabase PostgreSQL with strict Row Level Security (RLS) and transaction integrity to eliminate seat double-booking permanently.

---

## 🎨 Visual Identity & Brand Guidelines

- **Primary Navy**: `#142B4A`
- **Dark Navy**: `#0B1F3A`
- **Primary Teal**: `#14B8A6`
- **Light Teal**: `#E6FFFA`
- **Orange Accent**: `#F59E0B` / `#EA580C`
- **Page Background**: `#F3F6FA`
- **Typography**: Inter / Plus Jakarta Sans

---

## 👥 5 Unified Role Perspectives & Demo Logins

Ticketora features an interactive **Instant Role Switcher** dropdown in the top navigation bar and login screen:

| Role | Demo Identity | Target Module | Scope |
| :--- | :--- | :--- | :--- |
| **Customer** | Anik Sen (`anik.sen@gmail.com`) | `/dashboard` | Online booking, seat selection, E-ticket generation, self-service cancellation |
| **Counter Staff** | Rafiqul Islam (`gabtoli.counter@ticketora.com`) | `/counter` | High-rush bus terminal POS, fast booking, cash change calculator, thermal reprinting |
| **Counter Manager** | Kamal Uddin (`gabtoli.manager@ticketora.com`) | `/counter-manager` | Counter supervisor, shift cash balancing, drawer reconciliation, sales audit |
| **Operator Admin** | Ashraf Hossain (`greenline.admin@ticketora.com`) | `/operator` | Green Line fleet, seat layout builder, route stops, trip scheduling, occupancy reports |
| **Super Admin** | Rahman Chowdhury (`admin@ticketora.com`) | `/admin` | Master administration, operators registry, terminals, system bookings, audit logs, policies |

---

## 🚀 Key Modules & Capabilities

### 1. Advanced Bus Search Engine (`/search`)
- Database-connected search by Origin City, Destination City, and Travel Date.
- Dynamic filters: AC vs Non-AC, Bus Operators, Coach Types (Business, Sleeper, Deluxe), Time Slots (Morning, Afternoon, Evening, Night), and Price Sliders.
- Sorting by Lowest Fare, Highest Fare, Earliest Departure, and Available Seats.

### 2. Configurable Bus Seat Layout Engine & Visual Seat Maps
- Supports `2+2 Standard (40 seats)`, `2+1 Business Class (27 seats)`, and `Royal Sleeper Double Deck (30 berths)`.
- Front cabin visuals with right-hand drive steering wheel, entry doors, central aisle, and rear windows.
- Seat states: Available (white with teal border), Selected (teal fill), Booked (slate gray), Held (amber fill with countdown timer), and Female Reserved.
- Custom Seat Layout Builder for bus operators.

### 3. Concurrency Protection & Expiring Seat Holds
- Prevents concurrent double-reservations: When a customer or counter clerk selects a seat, a 5-minute atomic hold is recorded.
- If another session attempts to select the same seat, the request is immediately rejected with clear feedback.
- Holds expire automatically and release safely.
- Database-level unique constraint on `(trip_id, seat_number)` guarantees transactional integrity.

### 4. Fast Bus Counter POS Terminal (`/counter`)
- Rapid 3-step booking flow designed for noisy, high-rush bus terminals.
- Instant change due calculator for cash transactions.
- Direct association with active counter staff shift opening balances.
- 1-click lost ticket search and thermal reprint.

### 5. Official E-Ticket & Boarding Pass (`/ticket/:bookingId`)
- Boarding pass styling with perforated tear-off design.
- Secure 2D QR Code containing verifiable token.
- Bus details, boarding point, reporting time (20 minutes prior), seat numbers, and itemized fare breakdown.
- Print-optimized CSS (`@media print`) for flawless paper and thermal printer output.

### 6. Track Booking (`/track-booking`)
- Instant lookup by Booking Reference (PNR e.g. `TKT-2026-8421`) or Mobile Number without needing to log in.

### 7. Cancellation & Policy-Based Refunds
- Automated calculation tiers:
  - 85% refund if cancelled > 24 hours prior to departure.
  - 60% refund if cancelled 12–24 hours prior.
  - Non-refundable after cutoff (< 6 hours).
- Cancelling instantly frees up seats for other customers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), React Router 7.
- **Components & Icons**: Lucide React, clsx, tailwind-merge, canvas-confetti, qrcode.react.
- **Backend & Database**: Supabase PostgreSQL with version-controlled migrations and Row Level Security.
- **Testing**: Vitest automated test suite.
- **Deployment**: Netlify SPA configuration (`netlify.toml`) & Supabase.

---

## 📦 Local Development Instructions

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
# Clone the repository and navigate into ticketora
cd ticketora

# Install dependencies
npm install

# Run the development server
npm run dev

# Run automated unit, concurrency, and transactional tests
npm test

# Build production bundle
npm run build
```

---

## 🗄️ Database Migrations & Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the migration script:
   `supabase/migrations/20261031000000_ticketora_master.sql`
4. Paste and run the seed script:
   `supabase/seed.sql`
5. Copy your project URL and public Anon key into `.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 🧪 Automated Test Suite Results

```text
✓ tests/ticketora.test.ts (10 tests) 31ms
  ✓ 01. Unit Tests: Currency, Formatting & Generators (3)
    ✓ formats BDT currency with Bangladeshi Taka symbol (৳)
    ✓ formats travel departure times into 12-hour AM/PM format
    ✓ generates unique booking reference starting with TKT-
  ✓ 02. Concurrency & Seat Holding Engine (3)
    ✓ allows a customer to hold an available seat
    ✓ prevents concurrent double-reservation when another user requests the same seat
    ✓ releases seat hold correctly
  ✓ 03. Transactional Booking & Double-Booking Prevention (2)
    ✓ creates a confirmed booking with accurate fare and payment
    ✓ strictly prevents double-booking the same confirmed seat on the same trip
  ✓ 04. Counter Operations & Shift Reconciliation (1)
    ✓ records counter ticket sale and increments active staff shift metrics
  ✓ 05. Cancellation & Policy-Based Refund Calculations (1)
    ✓ processes booking cancellation and frees seats back to available inventory

Test Files  1 passed (1)
Tests       10 passed (10)
```

---

## 🌐 Production Netlify Deployment

The repository includes `netlify.toml` configured for SPA routing.
1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure environment variables in Netlify site settings.

---

**TICKETORA** — *Your Journey, Our Priority. Book Easy. Travel Smart.*
