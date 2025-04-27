import type React from "react"
import InjectAddUserButton from "./inject-add-user-button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <InjectAddUserButton />
    </>
  )
}
