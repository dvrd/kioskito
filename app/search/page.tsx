import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"

import { type PageInfo, getProducts, findProduct } from "@/lib/api"
import { SearchProduct } from "@/components/search-product"
import LoadMore from "@/components/load-more"
import { ProductsList } from "@/components/product-list"

export const metadata: Metadata = {
  title: "Kiosko",
  description: "Storefront for the Kiosko app",
}

const loadProducts = async (next: PageInfo): Promise<{ next: PageInfo; html: JSX.Element }> => {
  "use server";
  const response = await getProducts({ numProducts: 10, cursor: next.endCursor });
  if (!response.ok) {
    throw new Error(response.error.message);
  }
  const { products, pageInfo } = response.value;
  return {
    html: <ProductsList products={products} />,
    next: pageInfo
  };
}

type Props = { searchParams: { query: string } }

export default async function Page({ searchParams: { query } }: Props) {
  const response = await findProduct(query);

  if (!response.ok) {
    throw Error(response.error.message);
  }

  const { products, pageInfo } = response.value;

  return (
    <div className="h-full w-full space-y-6">
      <div className="flex items-center justify-between flex-col-reverse sm:flex-row gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Buscando: {query}
          </h2>
        </div>
        <SearchProduct />
      </div>
      <Separator className="my-4" />
      {products.length > 0
        ? (
          <LoadMore loadMoreAction={loadProducts} next={pageInfo}>
            <ProductsList products={products} />
          </LoadMore>
        ) : (
          <div className="flex justify-center">
            <p>No se encontraron resultados</p>
          </div>
        )}
      <Separator className="my-4" />
    </div>
  )
}

