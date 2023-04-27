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
    console.log({aaaa: appState.cart.items})
    let count: number = 0, notToIncludePlaceholders: string = "";
    const notToInclude: string[] = [];
    appState.cart.items.forEach((item) => {
      count++;
      if(count === 1){
        notToIncludePlaceholders += "( ?,";
      } else if(count === appState.cart.items.length){
        notToIncludePlaceholders += " ?)";
      } else {
        notToIncludePlaceholders += "? ,"
      }
      notToInclude.push(item.product.id);
    });
    
    try {
      const response = await client.execute({
        sql: "select * from products where id not in " + notToIncludePlaceholders + " order by random() limit 4",
        args: notToInclude
      });
    
      const sortedData = responseDataAdapter(response);
      recommendations.value = sortedData;
    } catch (error) {
      recommendations.value = [];
    }
  });

  return recommendations.value.length &&
    <>
      <h3 class="text-xl">Recommended</h3>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {
          recommendations.value?.map((product: Product) => (<ProductCard product={product} key={product.id} />))
        }
      </ul>
    </>
});