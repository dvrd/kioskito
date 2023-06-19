import { ProductImage } from "@/components/product-image";

export const ProductsList = async ({
  products,
}: {
  products?: Product[];
}) => {
  return (
    <>
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
    </>
  );
};
