import { component$, Slot, useContextProvider, useStore } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

import Header from '~/components/starter/header/header';
import Footer from '~/components/starter/footer/footer';
import type { AppState, CartItem, /* User */ } from '~/utils/types';
import { APP_STATE, DEFAULT_USER } from '~/utils/constants';


export const useServerTimeLoader = routeLoader$(() /* :  ApiResponse */ => {
  return {
    date: new Date().toISOString(),
  };
});

export const cartItems: CartItem[] = [];

export default component$(() => {
  const appCart = {
    userId: 1,
    items: [],
    show: false
  }

  const appContext = useStore<AppState>({
    cart: appCart,
    user: DEFAULT_USER,
    filters: {
      priceHigh: 0,
      priceLow: 0,
      sort: {
        order: "",
        type: ""
      }
    },
  }, {deep: true});
  useContextProvider(APP_STATE, appContext);

  return (
    <div class="page">
      <main>
        <Header />
        <Slot />
      </main>
      <div class="section dark">
        <div class="container">
          <Footer />
        </div>
      </div>
    </div>
  );
});
