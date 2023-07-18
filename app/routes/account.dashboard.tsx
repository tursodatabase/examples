import { type LoaderArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";

import { orderItems, orders, users } from "drizzle/schema";
import { db } from "~/lib/client";
import { requireUserId } from "~/lib/session.server";

export async function loader({ request }: LoaderArgs): Promise<any> {
  const userId = await requireUserId({ request, redirectTo: "/account/login" });
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard - The Mug Store" },
    { name: "description", content: "User dashboard page" },
  ];
};
  if (!userId || typeof userId !== "string") {
    return redirect("/account/login");
  } else {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();
    const userOrders = await db
      .select()
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(eq(orders.userId, userId))
      .all();

    return {
      orders: userOrders,
      user,
    };
  }
}

export default function AccountDashboard() {
  const { orders, user } = useLoaderData<typeof loader>();

  function formatDate(date: number) {
    const day = new Date(date * 1000).getDate();
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][new Date(date * 1000).getMonth()];
    const year = new Date(date * 1000).getFullYear();
    return `${day} ${month}, ${year}`;
  }
  return (
    <div className="flex flex-col min-h-screen space-x-8 space-y-8">
      <h1 className="p-6 text-gray-600">Hello {user.firstName}!</h1>
      <section className="relative justify-end flex flex-col -mt-nav">
        {orders.length ? (
          <div className="flex flex-col p-2 space-y-4">
            <h2 className="p-2 text-gray-500 text-center">
              Here is your order history.
            </h2>
            <table className="p-2">
              <thead>
                <th>Date</th>
                <th>Total Cost</th>
                <th>Shipping to</th>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {formatDate(order.orders.createdAt)}
                    </td>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {order.orders.finalAmount}$
                    </td>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {order.orders.shippingAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No pending orders!</div>
        )}
      </section>
    </div>
  );
}
