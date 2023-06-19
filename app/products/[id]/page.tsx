import { Variants } from "@/components/variants"
import { getProduct } from "@/lib/api"

type Props = {
  params: {
    id: string
  }
}

export default async function Product({ params: { id } }: Props) {
  const response = await getProduct(id)
  if  (!response.ok) {
    throw Error(response.error.message)
  } 

  const product = response.value

  return (
    <div className="flex h-full w-full space-y-6 items-center justify-center">
      <Variants product={product} />
    </div>
  )
}
