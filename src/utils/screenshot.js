import html2canvas from "html2canvas"

export async function screenshot(target, filename) {
  const canvas = await html2canvas(target)
  const image = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.href = image
  link.download = filename || `${new Date().toLocaleString()}.png`
  link.click()
}
