import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData, useLocation } from "@remix-run/react";

import { categories, products } from "drizzle/schema";
import { ProductCard } from "~/components/ProductCard";
import { db } from "~/lib/client";
import { resizeImage } from "~/lib/resizeImage";
import type { Category, Product } from "~/lib/types";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "The Mug Store" },
    { name: "description", content: "Welcome to the Mug store!" },
  ];
};

export async function loader() {
  const featuredProducts = await db.select().from(products).limit(6).all();

  const featuredCategories = await db.select().from(categories).limit(4).all();

  return {
    featuredProducts: featuredProducts as unknown as Product[],
    featuredCategories: featuredCategories as unknown as Category[],
  };
}

export function getCategoryImage(category: string) {
  const imageUrl = `https://res.cloudinary.com/djx5h4cjt/image/upload/v1686305552/twitpics/mug-club/${category}-mugs.jpg`;
  return resizeImage(imageUrl, 400, 400);
}

export default function Index() {
  const { featuredCategories, featuredProducts } =
    useLoaderData<typeof loader>();
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen space-y-8">
      <section className="relative justify-end flex flex-col -mt-nav">
        <div className="grid flex-grow grid-flow-col auto-cols-fr content-stretch overflow-clip">
          <img
            src="https://res.cloudinary.com/djx5h4cjt/image/upload/v1686227497/twitpics/mug-club/hero-1.jpg"
            alt="Hero 1"
            className="w-full h-auto"
          />

          <div className="absolute bottom-8 left-4 flex flex-col space-y-6">
            <h2 className="text-5xl text-white font-bold">
              Mugs for all reasons
            </h2>
            <a href="/mugs" className="text-xl text-white font-semibold">
              Shop now →
            </a>
          </div>
        </div>
      </section>

      <div className="flex flex-col space-x-4 space-y-4 px-4">
        <h3 className="font-semibold">Featured Products</h3>

        <ul className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {featuredProducts && featuredProducts.length ? (
            featuredProducts.map((product: Product) => (
              <ProductCard
                {...{ product, actionPath: location.pathname }}
                key={product.id}
              />
            ))
          ) : (
            <div className="p-8">No items</div>
          )}
        </ul>
      </div>

      <section className="relative justify-end flex flex-col -mt-nav">
        <div className="grid flex-grow grid-flow-col auto-cols-fr content-stretch overflow-clip">
          <img
            src="https://res.cloudinary.com/djx5h4cjt/image/upload/v1686227497/twitpics/mug-club/hero-2.jpg"
            alt="Hero 1"
            className="w-full h-auto"
          />

          <div className="absolute bottom-8 left-4 flex flex-col space-y-6">
            <h3 className="text-5xl text-secondary-500 font-bold">
              2 Mugs = 2 Hugs 🙂
            </h3>
            <a
              href="/mugs"
              className="text-xl text-secondary-500 font-semibold"
            >
              Buy 2 Mugs for the price of one →
            </a>
          </div>
        </div>
      </section>

      <div className="flex flex-col space-x-4 mt-0 px-4">
        <h3 className="font-semibold">Featured Categories</h3>

        <div className="flex space-x-4 py-4 w-full">
          {featuredCategories.length ? (
            featuredCategories.map((category: Category) => (
              <a
                title={
                  category.name.includes("Cool") ? "Cool Mugs" : "Lame Mugs"
                }
                key={category.id}
                href="/mugs"
                className="relative w-1/2 min-h-[400px] bg-no-repeat bg-cover bg-center"
                style={{
                  backgroundImage: category.name.includes("Cool")
                    ? `url(${getCategoryImage("cool")})`
                    : `url(${getCategoryImage("lame")})`,
                }}
              >
                <div>
                  <p className="absolute bottom-4 p-4 bg-secondary-700 text-white">
                    Buy {category.name.includes("Cool") ? "Cool" : "Lame"} Mugs
                  </p>
                </div>
              </a>
            ))
          ) : (
            <h3>There are no categories to display!</h3>
          )}
        </div>
      </div>

      <section className="relative justify-end flex flex-col -mt-nav">
        <div className="grid flex-grow grid-flow-col auto-cols-fr content-stretch overflow-clip">
          <img
            src="https://res.cloudinary.com/djx5h4cjt/image/upload/v1686227497/twitpics/mug-club/hero-3.jpg"
            alt="Hero 1"
            className="w-full h-auto"
          />

          <div className="absolute bottom-8 left-4 flex flex-col space-y-6">
            <h3 className="text-5xl text-white font-bold">
              A good day begins with a Mug
            </h3>
            <a href="/mugs" className="text-xl text-white font-semibold">
              Brighen you mornings →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
