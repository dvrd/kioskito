"use client"

import { useContext, useState } from "react"
import Image from "next/image"
import { PlusSquare, ShoppingCart } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Variants } from "@/components/variants"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import { CartContext } from "@/context/cart"

interface ProductImageProps extends React.ReactHTMLElement<HTMLDivElement> {
  product: Product
  aspectRatio?: "portrait" | "square"
  idx: number
  width?: number
  height?: number
  className?: string
}

export function ProductImage({
  product,
  aspectRatio = "portrait",
  idx,
  width,
  height,
  className,
  ...props
}: ProductImageProps) {
  const { state, dispatch } = useContext(CartContext);
  const [isVisible, setIsVisible] = useState(false)
  const isInCart = state.merchandise.includes(product.variants[0].id)
  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }} 
      transition={{ type: "spring", delay: idx * 0.15 }}
    >
      <div id={product.handle} role="product" className={cn("flex flex-col items-center", className)} {...props}>
      <div className="space-y-3" >
        <Popover open={isVisible} onOpenChange={state => setIsVisible(state)}>
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
          <AnimatePresence>
            {isVisible && (
              <PopoverContent side="bottom" className="w-max p-0 border-none shadow-none" sideOffset={-360}>
                <motion.div
                  key={product.id}
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  exit={{ y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Variants product={product} />
                </motion.div>
              </PopoverContent>
            )}
          </AnimatePresence>
        </Popover>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium leading-none mr-1">{product.title}</h3>
            <Button
              size="sm"
              className="w-fit h-fit p-0 hover:scale-150 duration-300 transition-all"
              onClick={() => {
                if (isInCart) {
                  dispatch({ type: "REMOVE", payload: product.variants[0].id })
                } else {
                  dispatch({ type: "ADD", payload: product.variants[0].id })
                }
              }}
            >
              <AnimatePresence initial={false}>
                {isInCart
                  ? (
                    <motion.span
                      key="in-cart"
                      animate={{
                        translateY: [180, 0],
                      }}
                      exit={{
                        position: "absolute",
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <ShoppingCart className="h-6 w-6 p-1 text-white" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="off-cart"
                      animate={{
                        translateY: [180, 0],
                      }}
                      exit={{
                        position: "absolute",
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <PlusSquare className="w-6 h-6 text-white" />
                    </motion.span>
                  )}
              </AnimatePresence>
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <p className="text-lg text-muted-foreground">{product.variants[0].price.amount}</p>
            <p className="text-lg text-muted-foreground">{product.variants[0].price.currencyCode}</p>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  )
}
