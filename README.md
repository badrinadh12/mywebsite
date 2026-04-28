# My Website — Handloom Sarees (v2)

## 📁 File Structure
```
mywebsite/
├── index.html
├── css/style.css
├── js/
│   ├── products.js   ← ⭐ Edit this to add sarees & photos
│   └── main.js
├── images/           ← Put your saree photos here
└── README.md
```

---

## 📸 How to Add Your Own Photos

### From your phone (easiest):
1. Open Google Drive on your phone
2. Upload your saree photo to a folder
3. Once the site is on GitHub, add photos using the GitHub mobile app

### Steps:
1. Copy the photo into the `images/` folder — name it simply e.g. `saree1.jpg`
2. Open `js/products.js`
3. Find the saree and change:
   ```
   img: null
   ```
   to:
   ```
   img: "images/saree1.jpg"
   ```
4. Save and upload to GitHub — website updates automatically!

**Tip:** Keep photo files under 1MB for fast loading. Use free tools like TinyPNG to compress.

---

## 🛍️ Adding / Editing Sarees

Open `js/products.js`. Each saree block:

```js
{
  id: 9,                              // give a unique number
  name: "Saree Name",
  category: ["silk", "zari", "new"], // pick from: silk, cotton, zari, new
  material: "Pure Silk • Zari",
  price: "₹12,000",
  priceValue: 12000,                 // ← IMPORTANT: numeric price for filter
  badge: "New",                      // "New" | "Sold Out" | null
  desc: "Short description.",
  img: "images/saree9.jpg",          // or null
  color: "#8b1a1a"                   // placeholder background color
}
```

---

## 🚀 Deploy on GitHub Pages

1. Go to **github.com** → Sign up free
2. Click **+** → **New repository** → name: `mywebsite` → Public → Create
3. Click **uploading an existing file** → drag all files & folders → **Commit changes**
4. Go to **Settings** → **Pages** → Source: `main` branch → Save
5. Live at: `https://YOUR-USERNAME.github.io/mywebsite/`

### Updating later (add photos, change prices):
- Go to your repo on GitHub
- Click the file → Edit (pencil icon) or upload new files
- Changes go live in ~1 minute

---

## ✨ Features in This Version
- 🔍 Search bar (name, material, colour, description)
- 🏷️ Type filter (Silk, Cotton, Zari, New Arrivals)
- 💰 Price filter (Under ₹3K / ₹3K–10K / ₹10K–20K / ₹20K+)
- ♡ Wishlist (saved in browser, enquire all at once on WhatsApp)
- 🔎 Zoom / Detail page for each saree
- 📱 WhatsApp ordering with pre-filled message
- 📲 Mobile responsive + hamburger menu
- 🟢 Floating WhatsApp button

---

## 📞 WhatsApp Number
Currently set to: **+91 63059 06221**

To change: open `js/main.js` line 2:
```js
const OWNER_PHONE = "916305906221";
```
Also update in `index.html` (search for `916305906221`).
