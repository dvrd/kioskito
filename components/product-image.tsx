"use client"

import { useContext } from "react"
import Image from "next/image"
import { PlusSquare, ShoppingCart } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Variants } from "@/components/variants"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import { CartContext } from "@/context/cart"

interface ProductImageProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}


export function ProductImage({
  product,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ProductImageProps) {
  const { state, dispatch } = useContext(CartContext);
  const isInCart = state.merchandise.includes(product.variants[0].id)
  return (
    <div id={product.handle} role="product" className={cn("flex flex-col items-center", className)} {...props}>
      <div className="space-y-3" >
        <Popover>
          <PopoverTrigger>
            <div className="overflow-hidden rounded-md relative">
              <Image
                src={product.featuredImage.url}
                alt={product.title}
                priority
                width={width}
                height={height}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 475))}`}
                className={cn(
                  `h-[${height}px] w-[${width}px] object-cover animate-in zoom-out duration-300 transition-all hover:scale-105 cursor-pointer`,
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-max animate-in slide-in-from-top duration-500 p-0 border-none shadow-none" sideOffset={-360}>
            <Variants product={product} />
          </PopoverContent>
        </Popover>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium leading-none mr-1">{product.title}</h3>
            <Button
              size="sm"
              className="w-fit h-fit p-0"
              onClick={() => {
                if (isInCart) {
                  dispatch({ type: "REMOVE", payload: product.variants[0].id })
                } else {
                  dispatch({ type: "ADD", payload: product.variants[0].id })
                }
              }}
            >
              {isInCart ? <ShoppingCart className="h-6 w-6 p-1 text-white" /> : <PlusSquare className="w-6 h-6 text-white" />}
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <p className="text-lg text-muted-foreground">{product.variants[0].price.amount}</p>
            <p className="text-lg text-muted-foreground">{product.variants[0].price.currencyCode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
