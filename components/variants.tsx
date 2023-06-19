"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import Link from "next/link"

type Props = {
  product: Product
}

export const colorMap = new Map<string, string>([
  ["Red", "bg-red-500"],
  ["Ocean", "bg-blue-400"],
  ["Green", "bg-green-500"],
  ["Olive", "bg-yellow-900"],
  ["Purple", "bg-purple-500"],
])

export const Variants = ({ product }: Props) => {
  const { title, description, handle, variants } = product
  
  const mappedVariants = useMemo(() => {
    return variants.reduce((map, variant) => {
      if (!variant.availableForSale) return map

      const [size, color] = variant.title.split(" / ")

      if (map.has(size)) {
        map.get(size)?.set(color || 'None', variant)
      } else {
        const newColor = new Map()
        newColor.set(color || 'None', variant)
        map.set(size, newColor)
      }

      return map
    }, new Map<string, Map<string, Variant>>())
  }, [variants])

  const firstKey = useMemo(() => mappedVariants.keys().next().value, [mappedVariants]) || ""
  const firstColor = useMemo(() => mappedVariants.get(firstKey)?.keys().next().value, [mappedVariants, firstKey]) || ""

  const [selectedSize, setSelectedSize] = useState<string>(firstKey)
  const [selectedColor, setSelectedColor] = useState<string>(firstColor)

  const currentVariant = mappedVariants.get(selectedSize)?.get(selectedColor);
  const availableColors = Array.from(mappedVariants.get(selectedSize)?.keys() || [])


  if (variants.length === 0 || !selectedSize || !selectedColor || !currentVariant) {
    return (
      <Card className="w-max flex-row-reverse flex">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-1">
            <p className="text-lg text-muted-foreground">{variants[0].price.amount}</p>
            <p className="text-lg text-muted-foreground">{variants[0].price.currencyCode}</p>
          </div>
          <CardDescription className="w-[300px] text-justify">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/products/${handle}`} className="overflow-hidden rounded-md">
            <Suspense fallback={<Image
              src={`data:image/svg+xml;base64,${toBase64(shimmer(225, 330))}`}
              alt="placeholder"
              priority
              width={225}
              height={330}
              className="h-auto w-full rounded-md opacity-50 object-cover animate-in zoom-out duration-300 transition-all hover:scale-105 cursor-pointer aspect-[3/4]"
            />}
            >
              <Image
                priority={true}
                src={variants[0].image.url}
                alt={variants[0].title}
                width={200}
                height={200}
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                className="h-auto w-auto object-cover aspect-square cursor-pointer"
              />
            </Suspense>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-max flex-row-reverse flex">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center space-x-1">
          <p className="text-lg text-muted-foreground">{currentVariant.price.amount}</p>
          <p className="text-lg text-muted-foreground">{currentVariant.price.currencyCode}</p>
        </div>
        <div className="flex flex-col py-4 gap-4">
          <div className="flex gap-4 flex-wrap max-w-[80%]">
            {Array.from(mappedVariants.keys()).map(size => (
              <div key={size} className="flex items-center">
                <Badge
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  className="cursor-pointer"
                >
                  {size}
                </Badge>
              </div>
            ))}
          </div>
          {selectedColor !== 'None' && (
            <>
              Color: {selectedColor as string}
              <div className="flex items-center space-x-1">
                {availableColors.map((color) => (
                  <Checkbox
                    key={color}
                    checked={selectedColor === color}
                    onCheckedChange={() => setSelectedColor(color)}
                    className={cn("w-4 h-4 rounded-full cursor-pointer", colorMap.get(color))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <CardDescription className="w-[300px] text-justify">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center p-0 pl-6">
        <Link href={`/products/${handle}`} className="overflow-hidden rounded-md">
          <Image
            priority
            src={currentVariant.image.url}
            alt={currentVariant.title}
            placeholder="blur"
            width={200}
            height={200}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`}
            className="h-auto w-auto object-cover aspect-square cursor-pointer"
          />
        </Link>
      </CardContent>
    </Card>
  )
}
