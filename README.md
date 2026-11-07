# Curls n Pearls - Pearl Jewellery Online Store

A fast, responsive, and elegant e-commerce website for pearl jewellery.

## Project Structure

```
curls-n-pearls/
│
├── index.html        # Main HTML structure and page layout
├── css/
│   └── style.css     # Design, layout, typography, and responsive styles
├── js/
│   └── app.js        # Store logic, cart, checkout, admin, and pearl physics
├── images/
│   └── hero-poster.webp  # First frame of the hero video (shown while it loads)
├── video/
│   └── hero.mp4          # Hero video: hand lets the necklace slip, pearls scatter
└── README.md         # Documentation & instructions
```

## How to Run This Website

### Method 1: Direct Double-Click (Quickest)
1. Open the `curls-n-pearls` folder.
2. Double-click **`index.html`** to launch it in any web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
3. The website will immediately load with all styling, images, and features.

---

### Method 2: Local Web Server (Recommended for Web Development)
Running through a local web server is standard practice for modern web development.

#### Option A: Using Python (Available on most systems)
Open Terminal (macOS/Linux) or PowerShell / Command Prompt (Windows) inside the `curls-n-pearls` folder and run:
```bash
python -m http.server 3000
```
Then open your browser and visit:
```
http://localhost:3000
```

#### Option B: Using Visual Studio Code (Live Server)
1. Open the `curls-n-pearls` folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **Open with Live Server**.
4. The page will open automatically in your browser with live hot-reloading on save.

#### Option C: Using Node.js
If you have Node.js installed, open terminal in the folder and run:
```bash
npx serve .
```

---

## Features & Navigation
- **Hero Section (scroll-scrubbed video)**:
  - The hero is a full-screen video pinned while you scroll. At the top of the page it shows the first frame (hand holding the necklace).
  - Scrolling down plays the video forward: the necklace slips from the hand and the pearls scatter across the table. Scrolling back up rewinds it.
  - The pearls stay on the table at the end. There is no thread-snap effect and no fading.
  - To change the video, replace `video/hero.mp4`. Re-encode with frequent keyframes so scrubbing stays smooth:
    `ffmpeg -i in.mp4 -an -c:v libx264 -crf 24 -g 4 -pix_fmt yuv420p -movflags +faststart video/hero.mp4`
- **Shop & Catalog**: Browse necklaces, bracelets, earrings, and bridal sets with category filtering and price sorting.
- **Cart & Checkout**: Real-time calculations with coupon code discounts (try code `PEARL10` or `WELCOME200`), tax, and shipping calculation.
- **Admin Dashboard**: Manage inventory, add/edit products, track orders, customers, and discount coupons (accessible via the `#admin` route or the menu drawer).
- **Data Persistence**: Uses browser `localStorage` so changes and test orders are automatically saved across page reloads.
