"use client"

import { signOut } from "next-auth/react"

export default function UserMenu({
  name,
  image,
}: {
  name?: string | null
  image?: string | null
}) {
  return (
    <div className="flex items-center gap-3">
      {image ? (
        <img src={image} alt="" width={28} height={28} className="rounded-full" />
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
          {name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      {name && <span className="text-sm text-secondary">{name}</span>}
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="cursor-pointer rounded px-3 py-1 text-sm text-muted transition-colors hover:text-primary"
      >
        Sign out
      </button>
    </div>
  )
}
