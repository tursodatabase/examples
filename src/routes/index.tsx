import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { responseDataAdapter } from '~/utils/response-adapter';
import { client } from '~/utils/turso-db';


interface Product {
  name: string;
  image: string;
  id: string;
  description: string;
  price: number;
  category_id: string;
  created_at: number;
}

interface ProductsResponse {
  products: Product[];
}

export const useProductsLoader = routeLoader$<ProductsResponse>(async () => {
  const response = await client.execute("select * from products limit 10");
  const allProducts = responseDataAdapter(response);

  if(!response){
    return {
      products: [],
    }
  }
  return {
    products: allProducts as Product[]
  }
})

const ProductCard = (props: {product: Product}) => {
  const otherImages = (categoryId: string) => categoryId === "clothing" ? "/clothing.jpeg" : "/furniture.jpeg"
  return (
    <li>
      <a href="#" class="group block overflow-hidden">
        <img
          src={
            props.product.category_id === "electronics" ? "/clothing.jpeg" : otherImages(props.product.category_id)
          }
          alt=""
          class="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
        />

        <div class="relative bg-white pt-3">
          <h3
            class="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4"
          >
            {props.product.name}
          </h3>

          <p class="mt-2">
            <span class="sr-only"> Regular Price </span>

            <span class="tracking-wider text-gray-900"> ${props.product.price} USD </span>
          </p>
        </div>
      </a>
    </li>
  )
}

export default component$(() => {
  const products = useProductsLoader();

  return (
    <section>
      <div class="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div class="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
            <div class="max-w-md mx-auto text-center lg:text-left">
              <header>
                <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">TurQw Store</h2>

                <p class="mt-4 text-gray-500">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas
                  rerum quam amet provident nulla error!
                </p>
              </header>

              <a
                href="#"
                class="inline-block px-12 py-3 mt-8 text-sm font-medium text-white transition bg-gray-900 border border-gray-900 rounded hover:shadow focus:outline-none focus:ring"
              >
                Shop All
              </a>
            </div>
          </div>

          <div class="lg:col-span-2 lg:py-8">
            <ul class="grid grid-cols-2 gap-4">
              <li>
                <a href="/category/furniture" class="block group">
                  <img
                    src="/furniture.jpeg"
                    alt=""
                    class="object-cover w-full rounded aspect-square"
                  />

                  <div class="mt-3">
                    <h3
                      class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4"
                    >
                      Furniture
                    </h3>

                    <p class="mt-1 text-sm text-gray-700">Decorate your house with classic pieces</p>
                  </div>
                </a>
              </li>

              <li>
                <a href="/category/electronics" class="block group">
                  <img
                    src="/electronics.jpeg"
                    alt=""
                    class="object-cover w-full rounded aspect-square"
                  />

                  <div class="mt-3">
                    <h3
                      class="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4"
                    >
                      Electronics
                    </h3>

                    <p class="mt-1 text-sm text-gray-700">Gadgets to automate your life</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  );
});

export const head: DocumentHead = {
  title: 'TurQw shopping Cart',
  meta: [
    {
      name: 'description',
      content: 'A shopping cart built with Qwik and Turso',
    },
  ],
};
