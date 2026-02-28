import html2canvas from 'html2canvas'

export async function captureElementAsSnapshot(el: HTMLElement): Promise<Blob> {
  // Allow fonts/layout to settle before capture
  await new Promise((resolve) => setTimeout(resolve, 120))

  const canvas = await html2canvas(el, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#ffffff',
    width: el.scrollWidth,
    height: el.scrollHeight,
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to convert canvas to blob'))
    }, 'image/png')
  })
}

export function downloadSnapshot(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function shareSnapshot(blob: Blob, filename: string): Promise<boolean> {
  if (!navigator.share) return false
  const file = new File([blob], filename, { type: 'image/png' })
  if (!navigator.canShare || !navigator.canShare({ files: [file] })) return false
  try {
    await navigator.share({ files: [file] })
    return true
  } catch {
    return false
  }
}
