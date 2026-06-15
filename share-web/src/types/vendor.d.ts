import type React from 'react'

type EmojiMartElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  id?: string
  native?: string
  shortcodes?: string
  set?: string
  size?: string | number
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': EmojiMartElementProps
    }
  }
}
