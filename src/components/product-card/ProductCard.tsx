import { $, component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';
import cartDataAdapter from '~/utils/cartDataAdapter';
import { APP_STATE, DEFAULT_USER } from '~/utils/constants';
import { responseDataAdapter } from '~/utils/response-adapter';
import { client } from '~/utils/turso-db';
import type { Product, User } from '~/utils/types';

export interface ProductCartProps{
  product: Product
}

export const udpateWishlist = server$(async (isInWishlist: boolean, authenticatedUser: User, product: Product) => {
  try {
    if(!isInWishlist){
      const response = await client.execute({
        sql: "insert into wishlists(product_id, user_id) values(?, ?)",
        args: [product.id, authenticatedUser.id]
      })
      isInWishlist = response.rowsAffected === 1;
    } else {
      const response = await client.execute({
        sql: "delete from wishlists where product_id = ? and user_id = ?",
        args: [product.id, authenticatedUser.id]
      })
      isInWishlist = response.rowsAffected === 0;
    }

    return {
      isInWishlist
    }
  } catch (error) {
    console.log({error})
    return {
      isInWishlist
    }
  }
});

export const ProductCard = component$((props: ProductCartProps) => {
  const authenticatedUser = useSignal(DEFAULT_USER);
  const appState = useContext(APP_STATE);
  const isInWishlist = useSignal(false);

  useVisibleTask$(async () => {
    if(authenticatedUser.value.id){
      try {
        const checkWishlist = await client.execute({
          sql: "select count(*) from wishlists where user_id = ? and product_id = ?",
          args: [authenticatedUser.value.id, props.product.id]
        });
        isInWishlist.value = checkWishlist.rows[0]["count (*)"] === 1
      } catch (error) {
      }
    }
  })

  const addToCart = $(async () => {
    try {
      await client.execute({
        sql: "insert into cart_items(product_id, user_id) values(?, ?)",
        args: [props.product.id, authenticatedUser.value.id]
      });
      const cartItem = await client.execute({
        sql: "select * from cart_items where product_id = ? and user_id = ?",
        args: [props.product.id, authenticatedUser.value.id]
      });
      appState.cart.items.push({
        id: (100 * Math.random()) - 9,
        count: 1,
        product: props.product
      })
      const formattedResponse = responseDataAdapter(cartItem);
      appState.cart.items.push(cartDataAdapter(formattedResponse)[0])
    } catch (error) {
      console.log(error);
      return;
    }
  })

  return (
    <div class="group relative block overflow-hidden">
      <button
        class={`absolute right-4 top-4 z-10 rounded-full ${isInWishlist.value ? 'bg-red-600':'bg-white'} p-1.5 text-gray-900 transition hover:text-gray-900/75`}
        onClick$={async () =>{
          const response = await udpateWishlist(isInWishlist.value, authenticatedUser.value, props.product);
          isInWishlist.value = response.isInWishlist;
        }}
        title={isInWishlist.value ? "Add to wishlist":"Remove from wishlist"}
      >
        <span class="sr-only">Wishlist</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <a href={`/product/${props.product.id}`} class="group relative block overflow-hidden">
        <img
          src={props.product.image}
          alt=""
          class="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
        />
      </a>
     

      <div class="relative border border-gray-100 bg-white p-6">

      <a href={`/product/${props.product.id}`} class="group relative block overflow-hidden">
        <h3 class="mt-4 text-lg font-medium text-gray-900">{props.product.name}</h3>
      </a>

        <p class="mt-1.5 text-sm text-gray-700">${props.product.price}</p>

        <button
          class="block w-full rounded bg-yellow-400 p-4 text-sm font-medium transition hover:scale-105"
          onClick$={addToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>  
  )
});