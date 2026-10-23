import type { ChapterGuide } from '../../lib/chapterGuide'
import type { BookId } from '../../lib/types'

const modules = import.meta.glob(['./*.ts', '!./index.ts'], {
  eager: true,
}) as Record<string, { guide?: ChapterGuide }>

const GUIDES: ChapterGuide[] = Object.values(modules)
  .map((mod) => mod.guide)
  .filter((guide): guide is ChapterGuide => Boolean(guide))

export function getChapterGuide(
  bookId: BookId,
  lessonId: string,
): ChapterGuide | undefined {
  return GUIDES.find((g) => g.bookId === bookId && g.lessonId === lessonId)
}
