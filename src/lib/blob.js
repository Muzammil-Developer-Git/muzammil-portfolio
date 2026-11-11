export function dataUrlToBlob(dataUrl) {
  const [head, body] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] || "application/octet-stream";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function openDataUrl(dataUrl) {
  const url = URL.createObjectURL(dataUrlToBlob(dataUrl));
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function downloadDataUrl(dataUrl, filename) {
  const url = URL.createObjectURL(dataUrlToBlob(dataUrl));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}