import { v4 as uuidv4 } from "uuid";
import {
  type ActionArgs,
  type LoaderArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

import cartDataAdapter from "~/lib/cart-data-adapter";
import { products, cartItems } from "drizzle/schema";
import { db } from "~/lib/client";
import { requireUserId } from "~/lib/session.server";

export async function loader({ params, request }: LoaderArgs) {
  const userId = await requireUserId({ request, redirectTo: "/account/login" });

  if (!userId) {
    return [];
  }

  const storedCartItems = await db
    .select({
      count: cartItems.count,
      cart_item_id: cartItems.id,
      products,
    })
    .from(cartItems)
    .leftJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.userId, userId))
    .all();

  const cartItemsData = cartDataAdapter(storedCartItems);


  return {
    cartItems: cartItemsData,
  };
}

export async function action({ request }: ActionArgs): Promise<any> {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const userId = await requireUserId({ request, redirectTo: "/account/login" });
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["error", "Log in to add items to cart"],
    ]);
    return redirect(`/account/login?${searchParams}`);
  }

  const productId = values.product_id as string;
  const quantity = values.quantity;

  if (_action === "addToCart") {
    const cartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
      )
      .get();

    // append cart item count if exists
    if (cartItem) {
      const append = await db
        .update(cartItems)
        .set({ count: cartItem.count + 1 })
        .where(
          and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
        )
        .returning()
        .get();
      return json(append);
    } else {
      const id = uuidv4();
      console.log("values to insert: ", [
        id,
        productId,
        userId,
        (quantity || 1) as number,
      ]);
      const cartInsertionResponse = await db
        .insert(cartItems)
        .values({
          id,
          productId,
          userId,
          count: (quantity || 1) as number,
        })
        .returning()
        .get();
      return json(cartInsertionResponse);
    }
  }

  if (_action === "deleteCartItem") {
    const deleted = await db
      .delete(cartItems)
      .where(eq(cartItems.productId, productId))
      .returning()
      .get();

    return json(deleted);
  }

  return null;
}
