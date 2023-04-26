import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { CartPageItem } from "~/components/cart/CartPageItem";
import { Recommendations } from "~/components/recommendations/Recommendations";
import cartDataAdapter from "~/utils/cartDataAdapter";
import { APP_STATE, DEFAULT_USER } from "~/utils/constants";
import { responseDataAdapter } from "~/utils/response-adapter";
import { client } from "~/utils/turso-db";
import type { CartItem } from "~/utils/types";

export const useRouteLoader = routeLoader$(async (): Promise<CartItem[]> => {
  const storedCartItems = await client.execute({
    sql: "select cart_items.count, cart_items.id as cart_item_id, products.* from cart_items left join products on products.id = cart_items.product_id where user_id = ?",
    args: [DEFAULT_USER.id]
  });
  let cartItems: CartItem[] = []
  if(storedCartItems){
    const formattedCartData = responseDataAdapter(storedCartItems);
    cartItems = cartDataAdapter(formattedCartData);
  }

  return cartItems;
});

export default component$(() => {
  const appState = useContext(APP_STATE);
  const cartItems = useRouteLoader();
  
  useTask$(() => {
    appState.cart.items = cartItems.value;
  })

  return (
    <>
      {
        <div class="">
          <div
            class="relative w-screen border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >

            <div class="mt-4 space-y-6">
              <div class="flex flex-col space-y-4">
                {
                  appState.cart.items.length
                    ? appState.cart.items?.map((item: CartItem) => <CartPageItem key={item.id} {...item} />)
                    : <div class="flex w-full items-center p-4 gap-4">
                      Your cart is empty, continue shopping!
                    </div>
                }
              </div>

              <div class="space-y-4 text-center">
                <a
                  href="/checkout"
                  class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                >
                  Checkout
                </a>

                <a
                  href="/category/furniture"
                  class="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
                >
                  Continue shopping
                </a>
              </div>

              <Recommendations />
            </div>
          </div>
        </div>
      }
    </>
  );
});