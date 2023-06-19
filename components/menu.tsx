"use client"

import { UserButton } from "@clerk/nextjs"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export function Menu() {
  return (
    <div className="flex justify-between items-center py-1 px-2 lg:px-4">
      <Link href="/" className="font-bold">Kioskito</Link>
      <div className="flex gap-4 items-center">
        <ShoppingCart />
        <UserButton />
      </div>
    </div>
  )
}
