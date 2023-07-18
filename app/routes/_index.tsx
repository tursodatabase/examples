import type { LoaderArgs, LoaderFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import type { Category, Product } from "~/lib/types";

import { useLoaderData } from "@remix-run/react";
import { buildDbClient } from "~/lib/client";
import { ProductCard } from "~/components/ProductCard";
import { resizeImage } from "~/lib/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "The Mug Store" },
    { name: "description", content: "Welcome to the Mug store!" },
  ];
};

export const loader: LoaderFunction = async ({ context }: LoaderArgs) => {
  const db = buildDbClient(context);

  const featuredProducts = await db.query.products.findMany({
    columns: {
      description: false,
      categoryId: false,
    }
  });
  const featuredCategories = await db.query.categories.findMany();

  return {
    featuredProducts: featuredProducts as unknown as Product[],
    featuredCategories: featuredCategories as unknown as Category[],
  }
}

export default function Index() {
  const { featuredCategories, featuredProducts } =
    useLoaderData<typeof loader>();
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

        {featuredProducts.length ? (
          <ul className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {
              featuredProducts.map((product: Product) => (
                <ProductCard
                  {...{ product }}
                  key={product.id}
                />
              ))
            }
          </ul>
        ) : (
          <div className="p-4 flex justify-center">There are no available products, please check back later!</div>
        )}
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

        {featuredCategories.length ? (
          <div className="flex pl-0 space-x-4 py-4 w-full">
            {
              featuredCategories.map((category: Category) => (
                <a
                  title={
                    `${category.name.split(" ")[0]} Mugs`
                  }
                  key={category.id}
                  href="/mugs"
                  className="relative w-1/2 min-h-[400px] bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${resizeImage(category.image, 400, 400)})`,
                  }}
                >
                  <div>
                    <p className="absolute bottom-4 p-4 bg-secondary-700 text-white">
                      Buy {category.name.split(" ")[0]} Mugs
                    </p>
                  </div>
                </a>
              ))
            }
          </div>
        ) : (
          <div className="p-4 flex justify-center">There are no categories to display!</div>
        )}
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
