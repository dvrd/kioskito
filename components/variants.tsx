"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { cn, shimmer, toBase64 } from "@/lib/utils"
import Link from "next/link"
import { Loader2 } from "lucide-react"

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
  const [loading, setLoading] = useState(true)

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
  const [previousVariant, setPreviousVariant] = useState<Variant | null>(null)

  const currentVariant = mappedVariants.get(selectedSize)?.get(selectedColor);
  const availableColors = Array.from(mappedVariants.get(selectedSize)?.keys() || [])

  useEffect(() => {
    if (previousVariant?.image.url !== currentVariant?.image.url) setLoading(true)
  }, [previousVariant, currentVariant])

  if (!selectedSize || !selectedColor || !currentVariant) {
    return null
  }

  return (
    <Card className="w-max flex-row-reverse flex">
      <CardHeader className="max-h-[320px] w-[320px] p-0 m-6 overflow-scroll">
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
                  onClick={() => {
                    setSelectedSize(size)
                    setPreviousVariant(currentVariant)
                  }}
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
                    onCheckedChange={() => {
                      setSelectedColor(color)
                      setPreviousVariant(currentVariant)
                    }}
                    className={cn("w-4 h-4 rounded-full cursor-pointer", colorMap.get(color))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <CardDescription className="text-justify">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center p-6">
        <Link href={`/products/${handle}`} className="overflow-hidden relative rounded-md">
          <Image
            priority
            src={currentVariant.image.url}
            alt={currentVariant.title}
            onLoad={() => setLoading(false)}
            placeholder="blur"
            width={320}
            height={320}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(320, 320))}`}
            className="h-[320px] w-[320px] object-cover aspect-square cursor-pointer"
          />
          {loading && <Loader2 className="absolute animate-spin right-2 bottom-2" />}
        </Link>
      </CardContent>
    </Card>
  )
}
