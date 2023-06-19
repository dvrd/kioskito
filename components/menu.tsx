"use client"

import { useContext, useState, useTransition } from "react"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { CreditCard, DollarSign, Loader2, MinusSquare, ShoppingCart } from "lucide-react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createCart } from "@/lib/api"
import { cn, shimmer, toBase64 } from "@/lib/utils"
import { Button, buttonVariants } from "./ui/button"
import { CartContext } from "@/context/cart"

export function Menu() {
  const { state, dispatch } = useContext(CartContext);
  const [data, setData] = useState<Cart>()
  const [loading, startTransition] = useTransition()

  const handleOpenCart = () => {
    startTransition(async () => {
      const response = await createCart(state.merchandise)
      if (!response.ok) {
        throw Error(response.error.message)
      }
      setData(response.value)
    })
  }

  const handleRemoveItem = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!data) return
    const newData = data.lines.filter(({ merchandise }) => merchandise.id !== id)
    setData({ ...data, lines: newData })
    dispatch({ type: "REMOVE", payload: id })
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
                      <DropdownMenuItem className="justify-between gap-8" key={merchandise.id}>
                        <div className="flex gap-2 items-center">
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
                        </div>
                        <Button onClick={handleRemoveItem(merchandise.id)} variant="ghost" className="p-2">
                          <MinusSquare className="w-4 h-4" />
                        </Button>
                      </DropdownMenuItem>
                    ))
                  }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="flex items-center justify-between w-full font-semibold">
                      Subtotal: {data.cost.subtotalAmount.amount}
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="flex w-full font-semibold justify-between items-center" href="/checkout">
                      Pagar
                      <CreditCard className="w-4 h-4" />
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
