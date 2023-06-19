import { isGqlError, transformObject } from "@/lib/utils";

const query = `
query ($numProducts: Int!, $cursor: String) {
  products(first: $numProducts after: $cursor, query: "availableForSale:true") {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id 
        title
        handle
        description 
        availableForSale
        featuredImage {
          url
        } 
        variants(first: 100) {
          edges {
            node {
              id
              title
              image {
                url
              }
              availableForSale
              price {
                amount 
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}`

type ProductsPayload = {
  products: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string }
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string;
};

const isData = (value: unknown): value is GqlPayload => {
  return typeof value === "object" && value !== null && "data" in value;
}

export const getProducts = async (variables: { numProducts: number; cursor: string | null }): Promise<Result<ProductsPayload>> => {
  try {
    const request = await fetch(`https://mock.shop/api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    const response = await request.json();

    if (isGqlError(response)) {
      return { ok: false, error: new Error(response.errors[0].message) };
    }

    let data = isData(response) && 'products' in response.data
      ? response.data?.products
      : { products: [], pageInfo: { hasNextPage: false, endCursor: "" } };
    const products = transformObject(data) as Product[];
    return {
      ok: true,
      value: {
        products: products.filter((product) => product.availableForSale),
        pageInfo: data.pageInfo,
      }
    };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

const findQuery = (search: string) =>`
{
  products(first: 10, query: "availableForSale:true AND title:*${search}*") {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        handle
        description
        featuredImage {
          url
        } 
        variants(first: 100) {
          edges {
            node {
              id
              title
              image {
                url
              }
              availableForSale
              price {
                amount 
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

export const findProduct = async (search: string): Promise<Result<ProductsPayload>> => {
  try {
    const request = await fetch(`https://mock.shop/api?query=${findQuery(search)}`)
    const response = await request.json();

    if (isGqlError(response)) {
      return { ok: false, error: new Error(response.errors[0].message) };
    }

    if (!isData(response) || !('products' in response.data)) {
      return { ok: false, error: new Error("No available data") };
    }

    const pageInfo = response.data.products.pageInfo;
    const products = transformObject(response.data.products) as Product[];

    return {
      ok: true,
      value: {
        products,
        pageInfo,
      }
    };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
  
const productQuery = (search: string) =>`
{
  product(handle: "${search}") {
    id
    title
    handle
    description
    featuredImage {
      url
    } 
    variants(first: 100) {
      edges {
        node {
          id
          title
          image {
            url
          }
          availableForSale
          price {
            amount 
            currencyCode
          }
        }
      }
    }
  }
}
`;

export const getProduct = async (handle: string): Promise<Result<Product>> => {
  try {
    const request = await fetch(`https://mock.shop/api?query=${productQuery(handle)}`)
    const response = await request.json();

    if (isGqlError(response)) {
      return { ok: false, error: new Error(response.errors[0].message) };
    }

    if (!isData(response) || !('product' in response.data)) {
      return { ok: false, error: new Error("No available data") };
    }

    const product = transformObject(response.data.product) as Product;

    return {
      ok: true,
      value: product,
    };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

const cartQuery = (productIds: string[]) => `
mutation CartCreate {
  cartCreate(
    input: {
      lines: ${JSON.stringify(productIds.map(id => ({ quantity: 1, merchandiseId: id }))).replace(/"([^(")"]+)":/g,"$1:")}
    }
  ) {
    cart {
      id
      createdAt
      updatedAt
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
                image {
                  id
                  url
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

export const createCart = async (productIds: string[]): Promise<Result<Cart>> => {
  try {
    const request = await fetch('https://mock.shop/api', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: cartQuery(productIds),
      }),
    })
    const response = await request.json();

    if (isGqlError(response)) {
      return { ok: false, error: new Error(response.errors[0].message) };
    }

    if (!isData(response) || !('cartCreate' in response.data)) {
      return { ok: false, error: new Error("No available data") };
    }

    const product = transformObject(response.data.cartCreate.cart) as Cart;

    return {
      ok: true,
      value: product,
    };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

