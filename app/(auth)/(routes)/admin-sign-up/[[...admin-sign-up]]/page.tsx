// app/(auth)/(routes)/admin-sign-up/[[...admin-sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp 
        path="/admin-sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: "bg-red-600 hover:bg-red-700",
          }
        }}
      />
    </div>
  )
}