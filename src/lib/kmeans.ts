/**
 * K-means clustering for dominant color extraction from images.
 * Pure TypeScript, no external dependencies.
 */

export interface RGBPoint {
  r: number;
  g: number;
  b: number;
}

function distanceSq(a: RGBPoint, b: RGBPoint): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

function average(points: RGBPoint[]): RGBPoint {
  if (points.length === 0) return { r: 128, g: 128, b: 128 };
  const sum = points.reduce((acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }), { r: 0, g: 0, b: 0 });
  return { r: Math.round(sum.r / points.length), g: Math.round(sum.g / points.length), b: Math.round(sum.b / points.length) };
}

export function kMeans(pixels: RGBPoint[], k: number, maxIter = 20): RGBPoint[] {
  if (pixels.length === 0) return [];
  k = Math.min(k, pixels.length);

  // K-means++ initialization for better spread
  const centroids: RGBPoint[] = [pixels[Math.floor(Math.random() * pixels.length)]];
  while (centroids.length < k) {
    const distances = pixels.map((p) => Math.min(...centroids.map((c) => distanceSq(p, c))));
    const total = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < pixels.length; i++) {
      rand -= distances[i];
      if (rand <= 0) { centroids.push(pixels[i]); break; }
    }
    if (centroids.length < k) centroids.push(pixels[pixels.length - 1]);
  }

  const assignments = new Array(pixels.length).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    // Assign step
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let best = 0, bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const d = distanceSq(pixels[i], centroids[c]);
        if (d < bestDist) { bestDist = d; best = c; }
      }
      if (assignments[i] !== best) { assignments[i] = best; changed = true; }
    }
    if (!changed) break;

    // Update step
    for (let c = 0; c < k; c++) {
      const cluster = pixels.filter((_, i) => assignments[i] === c);
      if (cluster.length > 0) centroids[c] = average(cluster);
    }
  }

  // Sort by cluster size (most dominant first)
  const counts = centroids.map((_, c) => pixels.filter((_, i) => assignments[i] === c).length);
  const sorted = centroids
    .map((c, i) => ({ centroid: c, count: counts[i] }))
    .sort((a, b) => b.count - a.count);

  return sorted.map((s) => s.centroid);
}

/**
 * Sample pixels from an ImageData object (subsampled for performance)
 */
export function samplePixelsFromImageData(imageData: ImageData, maxSamples = 4000): RGBPoint[] {
  const pixels: RGBPoint[] = [];
  const data = imageData.data;
  const total = data.length / 4;
  const step = Math.max(1, Math.floor(total / maxSamples));

  for (let i = 0; i < total; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    // Skip very transparent or near-white/near-black pixels
    if (a < 128) continue;
    if (r > 245 && g > 245 && b > 245) continue;
    if (r < 10 && g < 10 && b < 10) continue;
    pixels.push({ r, g, b });
  }
  return pixels;
}
