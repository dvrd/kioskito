type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type GqlPayload = {
  data: {
    products: {
      edges: Product[];
      pageInfo: PageInfo;
    };
  } | {
    product: Product
  }
};

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  image: {
    url: string;
  };
  price: {
    amount: number;
    currencyCode: string;
  };
};

type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  featuredImage: {
    id: string;
    url: string;
  };
  variants: Variant[];
};


