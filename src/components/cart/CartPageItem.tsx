import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { APP_STATE, DEFAULT_USER } from '~/utils/constants';
import { client } from '~/utils/turso-db';
import type { CartItem } from '~/utils/types';

export const CartPageItem = component$((props: CartItem) => {
  const appState = useContext(APP_STATE);
  const authenticatedUser = useSignal(DEFAULT_USER);

  const deleteItem = $(async () => {
    await client.execute({
      sql: "delete from cart_items where user_id = ? and product_id = ?",
      args: [authenticatedUser.value.id, props.product.id]
    });
    const index = appState.cart.items.findIndex(item => item.id === props.id);
    if(index !== -1) appState.cart.items.splice(index, 1);
  })

  return <div class="flex w-full p-4 gap-4">
    <div>
      <img
        src={props.product.image || "Default image url"}
        alt=""
        class="h-64 w-64 rounded object-cover"
      />
    </div>

    <div class="flex-1 flex flex-col justify-start">
      <h3 class="text-gray-900">{props.product.name} <strong>x({props.count})</strong></h3>

      <div class="px-2 py-4 font-semibold">${props.product.price}</div>

      <p class="mt-0.5 space-y-px text-gray-600">
        {props.product.description}
      </p>
    </div>
    <div>
      <button class="p-1 rounded bg-red-600 text-white" onClick$={deleteItem}>
        <svg class="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>
      </button>
    </div>
  </div>
});