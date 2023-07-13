import html2canvas from "html2canvas"

export async function screenshot(target) {
  const canvas = await html2canvas(target)
  return canvas.toDataURL('image/png')
}
