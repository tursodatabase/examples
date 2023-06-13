import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";

import type { CartItem } from "~/lib/types";
import type { loader } from "~/routes/cart._index";

import { CartIcon } from "./Icon";
import { CartListItem } from "./CartListItem";

export const Cart = () => {
  const cartItems = useLoaderData<typeof loader>();
  const cartItemsFetcher = useFetcher();
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart((s) => !s);
  };

  useEffect(() => {
    const currentItems = cartItemsFetcher as unknown as CartItem[];

    cartItemsFetcher.submit(
      {},
      {
        action: "/manage-cart",
        method: "get",
      }
    );
  }, []);

  return (
    <div className="relative z-40">
      <button className="flex space-x-1 items-center" onClick={toggleCart}>
        <CartIcon color="#4ff8d2" />
        <span className="bg-secondary-400 text-black rounded-full p-1 h-5 w-5 flex items-center justify-center font-semibold">
          {cartItemsFetcher.data && cartItemsFetcher.data.cartItems
            ? cartItemsFetcher.data.cartItems.length
            : 0}
        </span>
      </button>

      {showCart && (
        <div className="fixed top-14 right-2 z-10 max-h[90vh]">
          <div
            className="relative w-screen max-w-sm border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8 drop-shadow-md"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            <button
              className="absolute end-4 top-4 text-gray-600 transition hover:scale-110"
              onClick={toggleCart}
            >
              <span className="sr-only">Close cart</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mt-4 space-y-6">
              <div className="flex flex-col space-y-4">
                {cartItemsFetcher.data &&
                  cartItemsFetcher.data.cartItems &&
                  cartItemsFetcher.data.cartItems.length ? (
                  cartItemsFetcher.data.cartItems.map((item: CartItem) => (
                    <div key={item.id} className="max-h-[80vh] overflow-y-auto">
                      <CartListItem {...item} />
                    </div>
                  ))
                ) : (
                  <div className="flex w-full items-center p-4 gap-4">
                    Your cart is empty, continue shopping!
                  </div>
                )}
              </div>

              <div className="space-y-4 text-center">
                <a
                  href="/cart"
                  className="block rounded border border-gray-600 px-5 py-3 transition hover:ring-1 hover:ring-gray-400"
                >
                  <span className="text-sm text-tertiary-800 font-semibold">
                    View my cart (
                    {cartItemsFetcher.data && cartItemsFetcher.data.cartItems
                      ? cartItemsFetcher.data.cartItems.length
                      : 0}
                    )
                  </span>
                </a>

                <a
                  href="/checkout"
                  className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                >
                  Checkout
                </a>

                <a href="/" className="inline-block text-sm">
                  <span className="text-gray-500 underline underline-offset-4 transition hover:text-gray-600">
                    Continue shopping
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
