import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://careercrafter.moshiurrahman.online';

const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/jobs', priority: 0.9, changefreq: 'daily' },
  { url: '/companies', priority: 0.8, changefreq: 'weekly' },
  { url: '/ai-resume', priority: 0.9, changefreq: 'weekly' },
  { url: '/ai-job-match', priority: 0.9, changefreq: 'weekly' },
  { url: '/cc/learn', priority: 0.9, changefreq: 'weekly' },
  { url: '/auth/signin', priority: 0.7, changefreq: 'weekly' },
  { url: '/about', priority: 0.5, changefreq: 'monthly' },
  { url: '/contact', priority: 0.5, changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(page => `  <url>\n` +
    `    <loc>${baseUrl}${page.url}</loc>\n` +
    `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n` +
    `    <changefreq>${page.changefreq}</changefreq>\n` +
    `    <priority>${page.priority}</priority>\n` +
    `  </url>\n`).join('') +
  `</urlset>`;

try {
  const outDir = path.join(__dirname, 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully!');
} catch (err) {
  console.error('❌ Failed to generate sitemap:', err);
  if (globalThis.process) globalThis.process.exitCode = 1;
}