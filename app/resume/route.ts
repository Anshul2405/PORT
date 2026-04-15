import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function GET() {
  const pdfPath = join(process.cwd(), 'Darwin-1.pdf')
  const pdf = await readFile(pdfPath)

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="anshul-raibole-resume.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
