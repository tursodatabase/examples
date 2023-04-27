import { component$, useContext, useSignal, useStore, useStylesScoped$, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import styles from "./checkout.css?inline"
import { APP_STATE, DEFAULT_USER } from '~/utils/constants';
import type { AppState, CartItem, User } from '~/utils/types';
import { server$, useNavigate } from '@builder.io/qwik-city';
import cartDataAdapter from '~/utils/cartDataAdapter';
import { client } from '~/utils/turso-db';


const placeOrder = server$(async (appState: AppState,  contactInformation: {firstName: string, lastName: string, email: string, phone: number}, shippingAddress: {zipCode: number, country: string}, authenticatedUser: User ) => {
  // * After having checked that the  payment was successfull using your payment client
    
  // check for missing input
  if(!contactInformation.firstName || !contactInformation.lastName || !contactInformation.email || !contactInformation.phone || !shippingAddress.country || !shippingAddress.zipCode){
    return {
      status: "error",
      message: "Some fields are missing!",
      data: null
    }
  }

  const amount = appState.cart.items.reduce((accumulator, currentVal) => accumulator + (currentVal.count * currentVal.product.price), 0);
  const calculatedShippingFees = 0;
  const discountAmount = 0;
  const finalAmount = amount + calculatedShippingFees - discountAmount;
  try {
    const newOrder = await client.execute({
      sql: "insert into orders(user_id, customer_name, amount, shipping_fees, discount_amt, final_amount, shipping_address, paid) values(?, ?, ?, ?, ?, ?, ?, ?)",
      args: [authenticatedUser.id, `${authenticatedUser.first_name} ${authenticatedUser.last_name}`, amount, calculatedShippingFees, discountAmount, finalAmount, `${shippingAddress.zipCode} ${shippingAddress.country}`, true]
    });
    
    if(newOrder.lastInsertRowid !== undefined){
  
      // Add items to created order
      for(const item of appState.cart.items){
        const transaction = await client.transaction();
        const itemAddedToOrder = await transaction.execute({
          sql: "insert into order_items(order_id, product_id, count) values(?, ?, ?);",
          args: [newOrder.lastInsertRowid, item.product.id, item.count]
        })
        if(itemAddedToOrder.rowsAffected > 0){
          const cartItemDeleted = await transaction.execute({
            sql: "delete from cart_items where id = ?;",
            args: [item.id]
          })
          if(cartItemDeleted.rowsAffected > 0){
            transaction.commit();
          }
        }
      }
      return {
        status: "success",
        message: "Order placed!",
        data: true
      }
    }
  } catch (error) {
    console.log({error});
  }
  return {
    status: "failure",
    message: "Could not create an order!",
    data: null
  }
})

export default component$(() => {
  useStylesScoped$(styles);
  const nav = useNavigate();
  const appState = useContext(APP_STATE);
  const authenticatedUser = DEFAULT_USER;
  const shippingAddress = useStore({
    country: "",
    zipCode: 0
  })
  const contactInformation = useStore({
    firstName: "",
    lastName: "",
    email: "",
    phone: 0
  })
  const submissionError = useSignal("");

  useVisibleTask$(() => {
    contactInformation.email = authenticatedUser.email;
    contactInformation.lastName = authenticatedUser.last_name;
    contactInformation.firstName = authenticatedUser.first_name;
    shippingAddress.country = "England";
  })

  const totalPrice = appState.cart.items.reduce((accumulator, currentVal) => accumulator + (currentVal.count * currentVal.product.price), 0).toFixed(2);

  // will run atleast once
  useTask$(async () => {
    const storedCartItems = await client.execute({
      sql: "select cart_items.count, cart_items.id as cart_item_id, products.* from cart_items left join products on products.id = cart_items.product_id where user_id = ?",
      args: [authenticatedUser.id]
    });
    appState.cart.items = cartDataAdapter(storedCartItems.rows as unknown as CartItem[]);
  });

  return (
    <section>
      <h1 class="sr-only">Checkout</h1>

      <div class="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
        <div class="bg-gray-50 py-12 md:py-24">
          <div class="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
            <div class="flex items-center gap-4">
              <span class="h-10 w-10 rounded-full bg-blue-700"></span>

              <h2 class="font-medium text-gray-900">TurQw store</h2>
            </div>

            <div>
              <p class="text-2xl font-medium tracking-tight text-gray-900">
                ${totalPrice}
              </p>

              <p class="mt-1 text-sm text-gray-600">For the purchase of</p>
            </div>

            <div>
              <div class="flow-root">
              <ul class="-my-4 divide-y divide-gray-100">
                { appState.cart.items?.map((item: CartItem) => 
                    <li key={item.id} class="flex items-center gap-4 py-4">
                      <img
                        src={item.product.image}
                        alt=""
                        class="h-16 w-16 rounded object-cover"
                      />

                      <div>
                        <h3 class="text-sm text-gray-900">{item.product.name} X {item.count}</h3>

                        <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                          <div>
                            <dt class="inline">${item.product.price}:</dt>
                          </div>
                        </dl>
                      </div>
                    </li>)
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white py-12 md:py-24">
          <div class="mx-auto max-w-lg px-4 lg:px-8">

            {submissionError.value && <p class="text-red-600 font-semibold">{submissionError.value}</p>}

            <form class="grid grid-cols-6 gap-4">
              <legend class="col-span-6">Contact Information</legend>
              <div class="col-span-3">
                <label
                  for="FirstName"
                  class="block text-xs font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={contactInformation.firstName}
                  onInput$={(e) => {
                    contactInformation.firstName = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>

              <div class="col-span-3">
                <label
                  for="LastName"
                  class="block text-xs font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={contactInformation.lastName}
                  onInput$={(e) => {
                    contactInformation.lastName = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>

              <div class="col-span-6">
                <label for="Email" class="block text-xs font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={contactInformation.email}
                  onInput$={(e) => {
                    contactInformation.email = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>

              <div class="col-span-6">
                <label for="Phone" class="block text-xs font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  id="Phone"
                  class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={contactInformation.phone}
                  onInput$={(e) => {
                    const typedVal = (e.target as HTMLInputElement).value;
                    if(!isNaN(parseInt(typedVal))){
                      contactInformation.phone = parseInt(typedVal);
                    }
                  }}
                />
              </div>

              <fieldset class="col-span-6">
                <legend class="block text-sm font-medium text-gray-700">
                  Card Details
                </legend>

                <div class="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                  <div>
                    <label for="CardNumber" class="sr-only"> Card Number </label>

                    <input
                      type="text"
                      id="CardNumber"
                      placeholder="Card Number"
                      class="relative mt-1 w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                  </div>

                  <div class="flex -space-x-px rtl:space-x-reverse">
                    <div class="flex-1">
                      <label for="CardExpiry" class="sr-only"> Card Expiry </label>

                      <input
                        type="text"
                        id="CardExpiry"
                        placeholder="Expiry Date"
                        class="relative w-full border-gray-200 focus:z-10 ltr:rounded-bl-md rtl:rounded-br-md sm:text-sm"
                      />
                    </div>

                    <div class="flex-1">
                      <label for="CardCVC" class="sr-only"> Card CVC </label>

                      <input
                        type="text"
                        id="CardCVC"
                        placeholder="CVC"
                        class="relative w-full border-gray-200 focus:z-10 ltr:rounded-br-md rtl:rounded-bl-md sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset class="col-span-6">
                <legend class="block text-sm font-medium text-gray-700">
                  Billing Address
                </legend>

                <div class="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                  <div>
                    <label for="Country" class="sr-only">Country</label>

                    <select
                      id="Country"
                      class="relative w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm"
                      onChange$={(e) => {
                        shippingAddress.country = (e.target as HTMLSelectElement).value;
                      }}
                    >
                      <option>England</option>
                      <option>Wales</option>
                      <option>Scotland</option>
                      <option>France</option>
                      <option>Belgium</option>
                      <option>Japan</option>
                    </select>
                  </div>

                  <div>
                    <label class="sr-only" for="PostalCode"> ZIP/Post Code </label>

                    <input
                      type="text"
                      id="PostalCode"
                      placeholder="ZIP/Post Code"
                      class="relative w-full rounded-b-md border-gray-200 focus:z-10 sm:text-sm"
                      onInput$={(e) => {
                        shippingAddress.zipCode = parseInt((e.target as HTMLInputElement).value);
                      }}
                    />
                  </div>
                </div>
              </fieldset>

              <div class="col-span-6">
                <button
                  class="block w-full rounded-md bg-black p-2.5 text-sm text-white transition hover:shadow-lg"
                  preventdefault:submit
                  preventdefault:click
                  onClick$={async () => {
                    submissionError.value = "";
                    const response = await placeOrder(appState, contactInformation, shippingAddress, authenticatedUser);
                    if(response.status === "error"){
                      submissionError.value = response.message;
                    }
                    if(response.status === "success"){
                      alert("Order successfully placed!");
                      nav("/category/furniture");
                    }
                  }}
                >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
});