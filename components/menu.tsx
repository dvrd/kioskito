"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { CreditCard, DollarSign, Loader2, ShoppingCart } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { createCart } from "@/lib/api"
import { cn, shimmer, toBase64 } from "@/lib/utils"
import { buttonVariants } from "./ui/button"

export function Menu() {
  const cart = useLocalStorage<string[]>('cart', [])
  const [data, setData] = useState<Cart>()
  const [loading, startTransition] = useTransition()

  const handleOpenCart = () => {
    startTransition(async () => {
      const response = await createCart(cart.value)
      if (!response.ok) {
        throw Error(response.error.message)
      }
      setData(response.value)
    })
  }

  const hasItems = data?.lines?.length

  return (
    <div className="flex justify-between items-center py-1 px-2 lg:px-4">
      <Link href="/" className="font-bold">Kioskito</Link>
      <div className="flex gap-4 items-center">
        <DropdownMenu onOpenChange={handleOpenCart}>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost' }), "p-2")}>
            <ShoppingCart />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Carrito</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hasItems && !loading
              ? (
                <>
                  {
                    data.lines.map(({ merchandise }) => (
                      <DropdownMenuItem className="gap-2 px-4" key={merchandise.id}>
                        <Image
                          src={merchandise.image.url}
                          alt={merchandise.title}
                          width={60}
                          height={80}
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                          placeholder="blur"
                          className="h-[60px] w-[80px] object-cover animate-in zoom-out duration-300 transition-all hover:scale-105 aspect-square"
                        />
                        {merchandise.title}
                      </DropdownMenuItem>
                    ))
                  }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="flex items-center justify-between w-full font-semibold">
                      Subtotal: {data.cost.subtotalAmount.amount}
                      <DollarSign className="w-6 h-6" />
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="flex w-full font-semibold justify-between items-center" href="/checkout">
                      Pagar
                      <CreditCard className="w-6 h-6" />
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : <span className="p-2 w-full flex items-center justify-center">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'No hay productos en el carrito'}</span>
            }
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </div>
  )
}
