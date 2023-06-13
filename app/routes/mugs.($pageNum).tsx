import type { LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData, useLocation } from "@remix-run/react";

import { Pagination } from "~/components/Pagination";
import { ProductCard } from "~/components/ProductCard";
import { ITEMS_PER_PAGE } from "~/lib/constants";
import type { Product } from "~/lib/types";
import { db } from "~/lib/client";
import { products } from "drizzle/schema";

export async function loader({ params }: LoaderArgs) {
  const { pageNum } = params;

  const allProducts = await db.select().from(products).all();

  const itemsCount = allProducts.length;
  const totalPages = Math.ceil((itemsCount as number) / ITEMS_PER_PAGE);
  let currentPage = 1,
    offset = 0;

  if (pageNum !== undefined) {
    currentPage = parseInt(pageNum);
    offset = currentPage > 1 ? currentPage * ITEMS_PER_PAGE : 0;
  }

  const data = await db
    .select()
    .from(products)
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .all();

  return {
    products: data as unknown as Product[],
    pageInfo: {
      currentPage,
      totalPages,
    },
  };
}

export default function () {
  const { products, pageInfo } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <>
      {!products.length ? (
        <div className="p-8">No items listed!</div>
      ) : (
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <header>
              <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                All Mugs
              </h1>
            </header>

            <ul className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {products && products.length ? (
                products.map((product: Product) => (
                  <ProductCard {...{ product }} key={product.id} />
                ))
              ) : (
                <div className="p-8">No items</div>
              )}
            </ul>

            <Pagination {...pageInfo} />
          </div>
        </section>
      )}
    </>
  );
}
