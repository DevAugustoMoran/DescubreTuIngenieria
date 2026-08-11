// /api/images.js
// Proxy hacia la API de Pexels — la llave nunca se expone al navegador.
// 1) Crea una cuenta gratis en https://www.pexels.com/api/ y genera tu API key.
// 2) En Vercel: Project Settings → Environment Variables → agrega PEXELS_API_KEY.
// 3) Coloca este archivo en tu carpeta /api junto a chat.js y analytics.js.

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Falta el parámetro 'query'." });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    // Sin llave configurada: no rompemos la app, solo avisamos.
    // El frontend debe manejar este caso mostrando la ilustración de respaldo.
    return res.status(200).json({ url: null, reason: "PEXELS_API_KEY no configurada" });
  }

  try {
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );

    if (!pexelsRes.ok) {
      return res.status(200).json({ url: null, reason: `Pexels respondió ${pexelsRes.status}` });
    }

    const data = await pexelsRes.json();
    const photo = data.photos && data.photos[0];

    if (!photo) {
      return res.status(200).json({ url: null, reason: "Sin resultados" });
    }

    // Cache en el borde/CDN de Vercel por 24h para no gastar cuota en cada visita.
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

    return res.status(200).json({
      url: photo.src.large,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pexelsUrl: photo.url,
    });
  } catch (e) {
    return res.status(200).json({ url: null, reason: "Error de red al consultar Pexels" });
  }
}