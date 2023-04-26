import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';
import { APP_STATE } from '~/utils/constants';
import { responseDataAdapter } from '~/utils/response-adapter';
import { client } from '~/utils/turso-db';
import type { Product } from '~/utils/types';
import { ProductCard } from '../product-card/ProductCard';

export const fetchProductRecommendations = server$(async (sql: string, args: string[]) => {
  console.log([sql, args])
  try {
    const response = await client.execute({
      sql: "select * from products where " + sql,
      args
    });
  
    const sortedData = responseDataAdapter(response);
  
    return {
      status: "",
      items: sortedData
    }
  } catch (error) {
    return {
      status: "",
      items: []
    }
  }
})

export const Recommendations = component$(() => {
  const appState = useContext(APP_STATE);

  const recommendations = useSignal<Product[]>([]);

  useVisibleTask$(async () => {
    let createSql = "";
    const argsList = [];
    for(let i = 0; i < appState.cart.items.length; i++){
      if(i + 1 !== appState.cart.items.length){
        createSql += "id <> ? and ";
      } else {
        createSql += "id <> ?";
      }
      argsList.push(appState.cart.items[i].product.id);
    }

    try {
      const response = await client.execute({
        sql: "select * from products where " + createSql + " order by random() limit 4",
        args: argsList
      });
    
      const sortedData = responseDataAdapter(response);
      recommendations.value = sortedData;
    } catch (error) {
      recommendations.value = [];
    }
  });

  return (
    <>
      <h3 class="text-xl">Recommended</h3>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {
          recommendations.value?.map((product: Product) => (<ProductCard product={product} key={product.id} />))
        }
      </ul>
    </>
  )
});