import { $, component$, useContext, useOn, useSignal, useTask$ } from '@builder.io/qwik';
import { CartIcon } from '../starter/icons/cart';
import { APP_STATE, DEFAULT_USER } from '~/utils/constants';
import type { CartItem } from '~/utils/types';
import { client } from '~/utils/turso-db';
import cartDataAdapter from '~/utils/cartDataAdapter';
import { CartListItem } from './CartListItem';

export const Cart = component$(() => {
  const appState = useContext(APP_STATE);
  const authenticatedUser = useSignal(DEFAULT_USER);

  // will run atleast once
  useTask$(async () => {
    try {
      const storedCartItems = await client.execute({
        sql: "select cart_items.count, cart_items.id as cart_item_id, products.* from cart_items left join products on products.id = cart_items.product_id where user_id = ?",
        args: [authenticatedUser.value.id]
      });
      const formattedCartData = [];
      if(storedCartItems.rows.length){
        for(const row of storedCartItems.rows){
          formattedCartData.push({...row})
        }
      }
      appState.cart.items = cartDataAdapter(formattedCartData);
    } catch (error) {
      console.log(error);
    }
  })

  const closeCart = $(() => {
    appState.cart.show = !appState.cart.show;
  });

  // * hide cart when esc key is clicked
  useOn("keydown", $((event: Event) => {
    if((event as KeyboardEvent).key === "Escape") {
      appState.cart.show = false;
    }
  }))

  return (
    <div class="z-20">
      <button class="flex space-x-1 items-center" onClick$={closeCart}>
        <CartIcon color="#4ff8d2" />
        <span class="bg-secondary-400 text-black rounded-full p-1 h-5 w-5 flex items-center justify-center font-semibold">{appState.cart.items.length}</span>
      </button>

      {
        appState.cart.show && <div class="fixed top-10 right-5 z-10">
          <div
            class="relative w-screen max-w-sm border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            <button class="absolute end-4 top-4 text-gray-600 transition hover:scale-110" onClick$={closeCart}>
              <span class="sr-only">Close cart</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div class="mt-4 space-y-6">
              <div class="flex flex-col space-y-4">
                {
                  appState.cart.items.length
                    ? appState.cart.items.map((item: CartItem) => <CartListItem key={item.id} {...item} />)
                    : <div class="flex w-full items-center p-4 gap-4">
                      Your cart is empty, continue shopping!
                    </div>
                }
              </div>

              <div class="space-y-4 text-center">
                <a
                  href="/cart"
                  class="block rounded border border-gray-600 px-5 py-3 text-sm transition hover:ring-1 hover:ring-gray-400 text-tertiary-800 font-semibold"
                >
                  View my cart ({appState.cart.items?.length || 0})
                </a>

                <a
                  href="/checkout"
                  class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                >
                  Checkout
                </a>

                <button
                  onClick$={closeCart}
                  class="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
});