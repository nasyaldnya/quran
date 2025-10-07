import fs from 'fs';
import https from 'https'; // ✨ تم تغيير هذا السطر

const BASE_URL = 'https://mp3quran.cam';
const API_URL = 'https://mp3quran.net/api/v3/reciters';

async function generateSitemap() {
    console.log('Fetching reciters list...');
    
    // ✨ تم تعديل طريقة جلب البيانات لتناسب Node.js
    https.get(API_URL, (res) => {
        let body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end", () => {
            try {
                const data = JSON.parse(body);
                const reciters = data.reciters;
                console.log(`Found ${reciters.length} reciters.`);

                const sitemapContent = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${reciters.map(reciter => `
    <url>
        <loc>${BASE_URL}/?reciter=${reciter.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    `).join('')}
</urlset>
                `.trim();

                fs.writeFileSync('sitemap.xml', sitemapContent);
                console.log('✅ sitemap.xml generated successfully!');
            } catch (error) {
                console.error("Error processing data:", error);
            }
        });

    }).on("error", (error) => {
        console.error('Error fetching API:', error);
    });
}

generateSitemap();