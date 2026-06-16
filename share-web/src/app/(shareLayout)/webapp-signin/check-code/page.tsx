import { Suspense } from 'react'
import CheckCodeContent from './content'

export default function CheckCode() {
  return (
    <Suspense fallback={null}>
      <CheckCodeContent />
    </Suspense>
  )
}
