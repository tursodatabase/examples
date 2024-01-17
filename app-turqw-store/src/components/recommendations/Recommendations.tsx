import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { APP_STATE } from '~/utils/constants';
import { client } from '~/utils/turso-db';
import type { Product } from '~/utils/types';
import { ProductCard } from '../product-card/ProductCard';

export const Recommendations = component$(() => {
  const appState = useContext(APP_STATE);

  const recommendedProducts = useSignal<Product[]>([]);

  useVisibleTask$(async () => {
    const placeholders = appState.cart.items.map(() => {
      return "?"
    }).join(",")
    const values = appState.cart.items.map(item => {
      return item.product.id;
    })
    
    try {
      const response = await client.execute({
        sql: `select * from products where id not in (${placeholders}) order by random() limit 4`,
        args: values
      });
      
      recommendedProducts.value = response.rows as unknown as Product[];
    } catch (error) {
      // TODO: Catch error and notify user
    }
  });

  return (
    recommendedProducts.value.length
      ? 
      <>
        <h3 class="text-xl">Recommended</h3>
        <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {
            recommendedProducts.value?.map((product: Product) => (<ProductCard product={product} key={product.id} />))
          }
        </ul>
      </>
      : <div></div>
    )
});