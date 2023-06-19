import { Suspense } from "react";
import Image from "next/image";

import { ProductImage } from "@/components/product-image";
import { shimmer, toBase64 } from "@/lib/utils";

export const ProductsList = async ({
  products,
}: {
  products?: Product[];
}) => {
  return (
    <>
      <Suspense fallback={<Image
          src={`data:image/svg+xml;base64,${toBase64(shimmer(225, 330))}`}
          alt="placeholder"
          priority
          width={225}
          height={330}
          className="h-auto w-full rounded-md opacity-50 object-cover animate-in zoom-out duration-300 transition-all hover:scale-105 cursor-pointer aspect-[3/4]"
        />}
      >
        {products && products.map((product) => (
          <ProductImage
            key={product.id}
            product={product}
            className="w-full"
            aspectRatio="portrait"
            width={250}
            height={330}
          />
        ))}
      </Suspense>
    </>
  );
};
