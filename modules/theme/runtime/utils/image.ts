import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'

async function bytesFromImage(image: HTMLImageElement) {
  return await new Promise<Uint8ClampedArray>((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      reject(new Error('Could not get canvas context'))
      return
    }
    const callback = () => {
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)
      let rect = [0, 0, image.width, image.height]
      const area = image.dataset['area']
      if (area && /^\d+(\s*,\s*\d+){3}$/.test(area)) {
        rect = area.split(/\s*,\s*!/).map((s) => parseInt(s, 10))
      }
      const [sx, sy, sw, sh] = rect
      resolve(context.getImageData(sx, sy, sw, sh).data)
    }
    if (image.complete) {
      callback()
    } else {
      image.onload = callback
    }
  })
}

function pixelsFromImageBytes(imageBytes: Uint8ClampedArray) {
  const pixels: number[] = []
  for (let i = 0; i < imageBytes.length; i += 4) {
    const r = imageBytes[i]
    const g = imageBytes[i + 1]
    const b = imageBytes[i + 2]
    const a = imageBytes[i + 3]
    if (a < 255) {
      continue
    }
    const argb = argbFromRgb(r, g, b)
    pixels.push(argb)
  }
  return pixels
}

async function pixelsFromImage(image: HTMLImageElement) {
  const imageBytes = await bytesFromImage(image)
  return pixelsFromImageBytes(imageBytes)
}

function prominentColorsFromPixels(pixels: number[], maxColors: number = 128) {
  return QuantizerCelebi.quantize(pixels, maxColors)
}

async function seedColorsFromImage(image: HTMLImageElement) {
  // Step 1 — Image to Pixels (bytes, pixels)
  const pixels = await pixelsFromImage(image)
  // Step 2 — Pixels to Prominent Colors (quantization,quantize)
  const prominentColors = prominentColorsFromPixels(pixels)
  // Step 3 — Prominent Colors to Suitable Seed Colors (score)
  return Score.score(prominentColors)
}

function bytesFromImageData({ data }: ImageData) {
  return new Uint8ClampedArray(data)
}

function scoreColors(colors: Map<number, number>) {
  return Score.score(colors)
}

export {
  scoreColors,
  bytesFromImage,
  pixelsFromImage,
  pixelsFromImageBytes,
  prominentColorsFromPixels,
  seedColorsFromImage,
  bytesFromImageData
}
