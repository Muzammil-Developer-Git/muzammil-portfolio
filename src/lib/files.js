export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_DATA_URL = 800000;

export function validateImage(file, maxMB = 10) {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG or WebP files are allowed.";
  }
  if (file.size > maxMB * 1024 * 1024) {
    return `The file must be smaller than ${maxMB} MB.`;
  }
  return null;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}

export async function cropToDataUrl(src, pixelCrop, size = 600) {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, size, size
  );

  let quality = 0.88;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (out.length > MAX_DATA_URL && quality > 0.4) {
    quality -= 0.1;
    out = canvas.toDataURL("image/jpeg", quality);
  }
  if (out.length > MAX_DATA_URL) {
    throw new Error("The image is still too large. Please choose a smaller image.");
  }
  return out;
}

export async function compressImage(file, { maxWidth = 800, maxChars = 90000 } = {}) {
  const src = await readFileAsDataUrl(file);
  const img = await loadImage(src);
  let width = Math.min(img.width, maxWidth);

  while (width >= 300) {
    const scale = width / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (let q = 0.85; q >= 0.4; q -= 0.1) {
      const out = canvas.toDataURL("image/jpeg", q);
      if (out.length <= maxChars) return out;
    }
    width = Math.round(width * 0.8);
  }
  throw new Error("This image is too large to store. Please choose a smaller image.");
}