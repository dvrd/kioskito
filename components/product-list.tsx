import { ProductImage } from "@/components/product-image";

export const ProductsList = async ({
  products,
}: {
  products?: Product[];
}) => {
  return (
    <>
      {products && products.map((product, idx) => (
        <ProductImage
          key={product.id}
          idx={idx}
          product={product}
          className="w-full"
          aspectRatio="portrait"
          width={250}
          height={330}
        />
      ))}
    </>
  );
};
