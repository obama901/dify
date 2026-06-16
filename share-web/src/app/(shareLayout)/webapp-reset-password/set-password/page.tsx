import { Suspense } from 'react'
import ChangePasswordForm from './content'

export default function SetPassword() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  )
}
