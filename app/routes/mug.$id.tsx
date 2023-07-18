import type { LoaderArgs, V2_MetaFunction } from "@remix-run/cloudflare";
// import { createClient } from "@libsql/client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import type { Product } from "~/lib/types";
import { db } from "~/lib/client";
import { products } from "drizzle/schema";


export const loader = async ({ params }: LoaderArgs) => {
  const { id } = params;
  if (!id) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Product id not found!",
    });
  }

  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .get();

  if (!product) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Product not found!",
    });
  }

  return {
    product: product as unknown as Product,
  };
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      {
        title: "Product Page",
      },
      {
        description: "Product page",
      },
    ];
  }
  const { product } = data;
  return [{
    title: product.name,
    description: product.description
  }]
};
export default function () {
  const pageData = useLoaderData<typeof loader>();
  const triggerAction = useFetcher();

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <img
              alt={pageData.product.name}
              src={pageData.product.image}
              className="aspect-square w-full rounded-xl object-cover"
            />
          </div>

          <div className="sticky top-0">
            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-xl font-bold sm:text-2xl">
                  {pageData.product.name}
                </h1>

                <p className="text-sm">Highest Rated Product</p>

                <div className="-ml-0.5 flex">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <p className="text-lg font-bold">${pageData.product.price}</p>
            </div>

            <div className="mt-4">
              <div className="prose max-w-none">
                <p>{pageData.product.description}</p>
              </div>

              <button className="mt-2 text-sm font-medium underline">
                Read More
              </button>
            </div>

            <triggerAction.Form
              method="post"
              action="/manage-cart"
              className="pt-8"
            >
              <input
                type="hidden"
                name="product_id"
                value={pageData.product.id}
              />
              <button
                className={
                  (triggerAction.state === "submitting" ||
                    triggerAction.state === "loading") &&
                    triggerAction.formData?.get("product_id") ===
                    pageData.product.id &&
                    triggerAction.formData?.get("_action") === "addToCart"
                    ? `block w-full rounded bg-yellow-600 p-4 text-sm font-medium hover:bg-yellow-700`
                    : `block w-full rounded bg-yellow-400 p-4 text-sm font-medium hover:bg-yellow-500`
                }
                name="_action"
                value="addToCart"
              >
                Add to Cart{" "}
                {(triggerAction.state === "submitting" ||
                  triggerAction.state === "loading") &&
                  triggerAction.formData?.get("product_id") ===
                  pageData.product.id &&
                  triggerAction.formData?.get("_action") === "addToCart" &&
                  "..."}
              </button>
            </triggerAction.Form>
          </div>
        </div>
      </div>
    </section>
  );
}
