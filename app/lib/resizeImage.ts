export function resizeImage(url: string, height: number, width: number) {
  return url.replace(/\/v[0-9]+/, `/c_lfill,g_center,h_${height},w_${width}`);
}
