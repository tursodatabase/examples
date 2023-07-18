import { useLoaderData } from "@remix-run/react";
import { notInArray } from "drizzle-orm";
import { type LoaderArgs, redirect, V2_MetaFunction } from "@remix-run/cloudflare";

import { Recommendations } from "~/components/Recommendations";
import type { CartItem, Product } from "~/lib/types";
import { CartPageItem } from "~/components/CartPageItem";
import { buildDbClient } from "~/lib/client";
import { products } from "drizzle/schema";
import { requireUserId } from "~/lib/session.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cart - The Mug Store" },
    { name: "description", content: "The cart page!" },
  ];
};

export async function loader({ request, context }: LoaderArgs): Promise<any> {
  const db = buildDbClient(context);
  const userId = await requireUserId({ request, redirectTo: "/account/login" }, context);

  if (userId === undefined) {
    return redirect("/account/login");
  } else {
    let recommendations: Product[] = [];
    const cartItems = await db.query.cartItems.findMany({
      where: (cartItems, { eq }) => eq(cartItems.userId, userId),
      columns: {
        count: true,
        id: true,
      },
      with: {
        product: true,
      },
    });

    const cartItemsIds = cartItems.map((item) => {
      return item.product.id;
    });

    let recommendationsResponse;
    if (cartItemsIds.length) {
      recommendationsResponse = await db
        .select()
        .from(products)
        .where(notInArray(products.id, cartItemsIds))
        .limit(4)
        .all();
    } else {
      recommendationsResponse = await db.query.products.findMany({
        limit: 4
      })
    }

    recommendations = recommendationsResponse as unknown as Product[];
    return {
      cartItems,
      recommendations,
    };
  }
}

export default function CartPage() {
  const { cartItems, recommendations } = useLoaderData<typeof loader>();

  return (
    <>
      {
        <div
          className="relative border border-gray-600 bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          <div className="mt-4 space-y-6">
            <div className="flex flex-col space-y-4">
              {cartItems.length ? (
                cartItems?.map((item: CartItem) => (
                  <CartPageItem key={item.id} {...item} />
                ))
              ) : (
                <div className="flex w-full items-center p-4 gap-4">
                  Your cart is empty, continue shopping!
                </div>
              )}
            </div>

            <div className="space-y-4 text-center max-w-[200px] mx-auto flex flex-col">
              <a
                href="/checkout"
                className="rounded bg-gray-700 px-5 py-2 py-3transition hover:bg-gray-600"
              >
                <span className="text-sm text-gray-100">Checkout</span>
              </a>

              <a
                href="/"
                className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
              >
                Continue shopping
              </a>
            </div>

            <Recommendations
              {...{ recommendations: recommendations }}
            />
          </div>
        </div>
      }
    </>
  );
}
