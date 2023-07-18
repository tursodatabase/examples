import { useLoaderData } from "@remix-run/react";
import { eq, notInArray } from "drizzle-orm";
import { type LoaderArgs, redirect } from "@remix-run/cloudflare";

import { Recommendations } from "~/components/Recommendations";
import cartDataAdapter from "~/lib/cart-data-adapter";
import type { CartItem, Product } from "~/lib/types";
import { CartPageItem } from "~/components/CartPageItem";
import { db } from "~/lib/client";
import { products, cartItems } from "drizzle/schema";
import { requireUserId } from "~/lib/session.server";

export async function loader({ request }: LoaderArgs): Promise<any> {
  const userId = await requireUserId({ request, redirectTo: "/account/login" });
  if (!userId || typeof userId !== "string") {
    return redirect("/account/login");
  } else {
    let cartItemsData: CartItem[] = [],
      recommendations: Product[] = [];
    try {
      const storedCartItems: any = await db
        .select({
          count: cartItems.count,
          cart_item_id: cartItems.id,
          products,
        })
        .from(cartItems)
        .leftJoin(products, eq(products.id, cartItems.productId))
        .where(eq(cartItems.userId, userId))
        .all();
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Cart - The Mug Store" },
    { name: "description", content: "The cart page!" },
  ];
};

      cartItemsData = cartDataAdapter(storedCartItems);

      const cartItemsIds = storedCartItems.map((item: any) => {
        return item.id;
      });

      let recommendationsResponse;
      if (cartItemsIds.length) {
        // console.log("... HERE");
        recommendationsResponse = await db
          .select()
          .from(products)
          .where(notInArray(products.id, cartItemsIds))
          .limit(4)
          .all();
      } else {
        recommendationsResponse = await db
          .select()
          .from(products)
          .limit(4)
          .all();
      }

      recommendations = recommendationsResponse as unknown as Product[];
    } catch (error) {
      // TODO: Catch error and notify user
    }
    return {
      cartItems: cartItemsData,
      recommendations,
    };
  }
}

export default function () {
  const cartData = useLoaderData<typeof loader>();

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
              {cartData.cartItems.length ? (
                cartData.cartItems?.map((item: CartItem) => (
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
                href="/category/furniture"
                className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
              >
                Continue shopping
              </a>
            </div>

            <Recommendations
              {...{ recommendations: cartData.recommendations }}
            />
          </div>
        </div>
      }
    </>
  );
}
