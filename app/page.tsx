import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"

import LoadMore from "@/components/load-more"
import { SearchProduct } from "@/components/search-product"
import { ProductsList } from "@/components/product-list"

import { type PageInfo, getProducts } from "@/lib/api"

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


export default async function Page() {
  const response = await getProducts({ numProducts: 10, cursor: null });

  if (!response.ok) {
    throw Error(response.error.message);
  }

  const { products, pageInfo } = response.value;

  return (
    <div className="h-full w-full space-y-6">
      <div className="flex items-center justify-between flex-col-reverse sm:flex-row gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Compra
          </h2>
          <p className="text-sm text-muted-foreground">
            Los mejores productos para ti el dia de hoy
          </p>
        </div>
        <SearchProduct />
      </div>
      <Separator className="my-4" />
      <LoadMore loadMoreAction={loadProducts} next={pageInfo}>
        <ProductsList products={products} />
      </LoadMore>
      <Separator className="my-4" />
    </div>
  )
}

