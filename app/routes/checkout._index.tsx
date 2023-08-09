import { v4 as uuidv4 } from "uuid";
import {
  type ActionArgs,
  type LoaderArgs,
  redirect,
  V2_MetaFunction,
} from "@remix-run/cloudflare";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useRevalidator,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";

import {
  cartItems,
  orderItems,
  orders,
} from "drizzle/schema";
import { requireUserId } from "~/lib/session.server";
import type { CartItem, User } from "~/lib/types";
import { buildDbClient } from "~/lib/client";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Checkout - The Mug Store" },
    { name: "description", content: "Customer checkout page" },
  ];
};

export async function loader({ request, context }: LoaderArgs): Promise<any> {
  const userId = await requireUserId({ request, redirectTo: "/account/login" }, context);
  if (!userId || typeof userId !== "string") {
    return redirect("/account/login");
  } else {
    const db = buildDbClient(context);
    let user;
    const cartItems = await db.query.cartItems.findMany({
      where: (cartItems, { eq }) => eq(cartItems.userId, userId),
      columns: {
        count: true,
        id: true,
      },
      with: {
        product: true,
        user: true
      },
    });
    if (!cartItems.length) {
      user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId)
      })
    } else {
      user = cartItems[0].user
    }
    return {
      cartItems,
      userData: user,
    };
  }
}

export const action = async ({
  request,
  context
}: ActionArgs) => {
  const userId = await requireUserId({ request, redirectTo: "/account/login" }, context);
  if (userId === undefined) {
    return redirect("/account/login");
  } else {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);

    // Validate submitted data (this is a simple, not fully adequate validation implementation)
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.email === "" ||
      values.phone === "" ||
      values.country === "" ||
      values.zipCode === ""
    ) {
      return {
        status: "error",
        message: "Some fields are missing!",
        data: null,
      };
    }

    const db = buildDbClient(context);

    try {
      const cartItemsData = await db.query.cartItems.findMany({
        where: (cartItems, { eq }) => eq(cartItems.userId, userId),
        columns: {
          count: true,
          id: true,
        },
        with: {
          product: true,
          user: true
        },
      });

      if (!cartItemsData.length) {
        return {
          status: "error",
          message: "Add something to your cart first",
          data: null,
        };
      }

      const amount = cartItemsData.reduce(
        (accumulator: number, currentVal: { count: number, product: { price: number } }) =>
          accumulator + currentVal.count * currentVal.product.price,
        0
      );
      const calculatedShippingFees = 0;
      const discountAmount = 0;
      const finalAmount = amount + calculatedShippingFees - discountAmount;

      const newOrder = await db
        .insert(orders)
        .values({
          id: uuidv4(),
          userId,
          customerName: `${values.firstName} ${values.lastName}`,
          amount,
          shippingFees: calculatedShippingFees,
          discountAmt: discountAmount,
          finalAmount,
          shippingAddress: `${values.zipCode} ${values.country}`,
        })
        .returning()
        .get();

      for (const item of cartItemsData) {
        const orderItemData = {
          id: uuidv4(),
          orderId: newOrder.id as string,
          productId: item.product.id,
          count: item.count,
        };
        await db.insert(orderItems).values(orderItemData).run();

        await db
          .delete(cartItems)
          .where(eq(cartItems.id, item.id)).run();
      }
      return {
        status: "success",
        data: true,
      };
    } catch (error) {
      // TODO: Catch error and notify user
      return {
        status: "failure",
        data: null,
      };
    }
  }
};

export default function Checkout() {
  const { cartItems, userData } =
    useLoaderData<typeof loader>();
  const makePayment = useFetcher<typeof action>();
  const nav = useNavigate();
  const revalidator = useRevalidator();

  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<number>();
  const [country] = useState<string>("England");

  useEffect(() => {
    setEmail(userData?.email || "");
    setLastName(userData?.lastName || "");
    setFirstName(userData?.firstName || "");
    setPhone(userData?.phone || "");

    if (
      makePayment.state !== "submitting" &&
      makePayment.state !== "loading" &&
      makePayment.data &&
      makePayment.data?.status === "success"
    ) {
      alert("Order successfully placed!");
      revalidator.revalidate();
      nav("/");
    }
  }, [makePayment]);

  return (
    <section>
      <h1 className="sr-only">Checkout</h1>

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-50 py-12 md:py-24">
          <div className="mx-auto max-w-lg space-y-8 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 rounded-full bg-tertiary-400 flex justify-center items-center text-2xl">
                🍵
              </span>

              <h2 className="font-medium text-gray-900">The Mug store</h2>
            </div>

            {!!cartItems.length && (
              <div>
                <p className="text-2xl font-medium tracking-tight text-gray-900">
                  $
                  {parseInt(
                    cartItems
                      .reduce(
                        (accumulator: any, currentVal: any) =>
                          accumulator +
                          currentVal.count * currentVal.product.price,
                        0
                      )
                      .toFixed(2)
                  )}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  For the purchase of
                </p>
              </div>
            )}

            <div>
              <div className="flow-root">
                <ul className="-my-4 divide-y divide-gray-100">
                  {cartItems.length ? (
                    cartItems.map((item: CartItem) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 py-4"
                      >
                        <img
                          src={item.product.image}
                          alt=""
                          className="h-16 w-16 rounded object-cover"
                        />

                        <div>
                          <h3 className="text-sm text-gray-900 font-semibold">
                            {item.product.name} X {item.count}
                          </h3>

                          <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                            <div>
                              <dt className="inline font-semibold">
                                ${(item.product.price * item.count).toFixed(2)}
                              </dt>
                            </div>
                          </dl>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="p-8 w-full text-center">
                      Your cart is empty.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-12 md:py-24">
          <div className="mx-auto max-w-lg px-4 lg:px-8">
            {makePayment.state !== "submitting" &&
              makePayment.state !== "loading" &&
              makePayment.data &&
              makePayment.data?.status === "success" && (
                <p className="text-green-600 font-semibold">
                  Order Placed
                </p>
              )}

            {makePayment.state !== "submitting" &&
              makePayment.state !== "loading" &&
              makePayment.data &&
              (makePayment.data?.status === "error" ||
                makePayment.data?.status === "failure") && (
                <p className="text-red-600 font-semibold">
                  Could not place order
                </p>
              )}

            <makePayment.Form className="grid grid-cols-6 gap-4" method="post">
              <legend className="col-span-6">Contact Information</legend>
              <div className="col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-xs font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  defaultValue={firstName}
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-xs font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  defaultValue={lastName}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-xs font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  defaultValue={email}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Phone"
                  className="block text-xs font-medium text-gray-700"
                >
                  Phone
                </label>

                <input
                  type="tel"
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  defaultValue={phone}
                  name="phone"
                />
              </div>

              <fieldset className="col-span-6">
                <legend className="block text-sm font-medium text-gray-700">
                  Card Details
                </legend>

                <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                  <div>
                    <label htmlFor="CardNumber" className="sr-only">
                      {" "}
                      Card Number{" "}
                    </label>

                    <input
                      type="text"
                      id="CardNumber"
                      placeholder="Card Number"
                      className="relative mt-1 w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                  </div>

                  <div className="flex -space-x-px rtl:space-x-reverse">
                    <div className="flex-1">
                      <label htmlFor="CardExpiry" className="sr-only">
                        {" "}
                        Card Expiry{" "}
                      </label>

                      <input
                        type="text"
                        id="CardExpiry"
                        placeholder="Expiry Date"
                        className="relative w-full border-gray-200 focus:z-10 ltr:rounded-bl-md rtl:rounded-br-md sm:text-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <label htmlFor="CardCVC" className="sr-only">
                        {" "}
                        Card CVC{" "}
                      </label>

                      <input
                        type="text"
                        id="CardCVC"
                        placeholder="CVC"
                        className="relative w-full border-gray-200 focus:z-10 ltr:rounded-br-md rtl:rounded-bl-md sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="col-span-6">
                <legend className="block text-sm font-medium text-gray-700">
                  Billing Address
                </legend>

                <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                  <div>
                    <label htmlFor="Country" className="sr-only">
                      Country
                    </label>

                    <select
                      className="relative w-full rounded-t-md border-gray-200 focus:z-10 sm:text-sm"
                      name="country"
                      defaultValue={country}
                    >
                      <option>England</option>
                      <option>Wales</option>
                      <option>Scotland</option>
                      <option>France</option>
                      <option>Belgium</option>
                      <option>Japan</option>
                      <option>Tanzania</option>
                    </select>
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="PostalCode">
                      {" "}
                      ZIP/Post Code{" "}
                    </label>

                    <input
                      type="number"
                      name="zipCode"
                      placeholder="ZIP/Post Code"
                      className="relative w-full rounded-b-md border-gray-200 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </fieldset>

              <input
                type="hidden"
                name="user_id"
                value={userData?.id}
              />

              <div className="col-span-6">
                <button
                  className="block w-full rounded-md bg-black disabled:bg-gray-300 disabled:cursor-not-allowed p-2.5 text-sm text-white transition hover:shadow-lg disabled:hover:shadow-none"
                  name="_action"
                  value="make_payment"
                  disabled={!cartItems.length}
                >
                  {(makePayment.state === "submitting" ||
                    makePayment.state === "loading") &&
                    !makePayment.data ? (
                    <span className="flex justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="animate-spin text-white w-6 h-6 fill-white"
                      >
                        <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path>
                      </svg>
                    </span>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </makePayment.Form>
          </div>
        </div>
      </div>
    </section>
  );
}
