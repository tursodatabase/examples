import type { LoaderArgs, LoaderFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/Pagination";
import { ProductCard } from "~/components/ProductCard";
import { buildDbClient } from "~/lib/client";
import type { Product } from "~/lib/types";

export const loader: LoaderFunction = async ({ params, context }: LoaderArgs) => {
  const db = buildDbClient(context);
  const { pageNum } = params;

  const allProducts = await db.query.products.findMany({
    columns: {
      name: true
    }
  });

  const itemsCount = allProducts.length;
  const itemsPerPage = context.env?.ITEMS_PER_PAGE || 20;
  const totalPages = Math.ceil((itemsCount as number) / itemsPerPage);
  let currentPage = 1,
    offset = 0;

  if (pageNum !== undefined) {
    currentPage = parseInt(pageNum);
    offset = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
  }

  const products = await db.query.products.findMany({
    offset: offset,
    limit: itemsPerPage
  });

  return {
    products: products as unknown as Product[],
    pageInfo: {
      currentPage,
      totalPages,
    },
  };
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      {
        title: "Mugs - The Mug Store",
      },
      {
        description: "Mugs listing page",
      },
    ];
  }
  const { pageInfo } = data;
  return [{
    title: pageInfo.currentPage ? "Mugs page " + pageInfo.currentPage : "Mugs - The Mug Store",
    description: pageInfo.currentPage ? "Mugs listing page " + pageInfo.currentPage : "Mugs listing page"
  }]
};

export default function Mugs() {
  const { products, pageInfo } = useLoaderData<typeof loader>();

  return (
    <>
      {!products.length ? (
        <div className="p-8 flex justify-center">
          There are no available products, please check back later!
        </div>
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