import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Components } from 'react-markdown'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const components: Partial<Components> = {
    // @ts-ignore - react-markdown types are not complete
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
        // @ts-ignore - SyntaxHighlighter types don't match the actual component props
        <SyntaxHighlighter
          // @ts-ignore - vscDarkPlus has the correct type internally
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    // @ts-ignore - remark-gfm types are not complete
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
} 