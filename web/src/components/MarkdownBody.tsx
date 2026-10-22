import Markdown from 'react-markdown'

/** Renders model Markdown (bold, lists, code, headings) as readable HTML. */
export function MarkdownBody({ text }: { text: string }) {
  return (
    <div className="md-body">
      <Markdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  )
}
