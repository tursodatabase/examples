import { v4 as uuidv4 } from "uuid";
import {
  type ActionArgs,
  type LoaderArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { and, eq } from "drizzle-orm";

import { cartItems } from "drizzle/schema";
import { requireUserId } from "~/lib/session.server";
import { buildDbClient } from "~/lib/client";

export async function loader({ request, context }: LoaderArgs) {
  const db = buildDbClient(context);
  const userId = await requireUserId(
    { request, redirectTo: "/account/login" },
    context
  );

  if (!userId) {
    return {
      cartItems: [],
    };
  }

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

  return {
    cartItems,
  };
}

export async function action({ request, context }: ActionArgs): Promise<any> {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  const userId = await requireUserId(
    { request, redirectTo: "/account/login" },
    context
  );
  if (userId === undefined) {
    const searchParams = new URLSearchParams([
      ["error", "Log in to add items to cart"],
    ]);
    return redirect(`/account/login?${searchParams}`);
  }

  const productId = values.product_id as string;
  const quantity = values.quantity;
  const db = buildDbClient(context);

  if (_action === "addToCart") {
    const cartItem = await db.query.cartItems.findFirst({
      where: (cartItems, { eq, and }) =>
        and(eq(cartItems.productId, productId), eq(cartItems.userId, userId)),
    });

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
