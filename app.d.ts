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
  } | {
    cartCreate: Cart
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

type Cart = {
  id: string;
  createdAt: string;
  updatedAt: string;
  lines: {
    id: string;
    merchandise: {
      id: string;
      title: string;
      image: {
        id: string;
        url: string;
      }
    }
  }[]
  cost: {
    totalAmount: {
      amount: number
      currencyCode: string
    },
    subtotalAmount: {
      amount: number
      currencyCode: string
    }
  }
}
