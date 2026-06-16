import { Suspense } from 'react'
import WebSSOForm from './content'

export default function WebappSignin() {
  return (
    <Suspense fallback={null}>
      <WebSSOForm />
    </Suspense>
  )
}
