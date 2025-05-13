const fs = require("fs");
const path = require("path");

// Define your website URL
const WEBSITE_URL = "https://connergroth.com";

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];

// Create sitemap content
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${WEBSITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

// Ensure the public directory exists
const publicDir = path.resolve(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap to public directory
fs.writeFileSync(path.resolve(publicDir, "sitemap.xml"), sitemap);

console.log("Sitemap generated successfully!");
