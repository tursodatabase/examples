import { type LoaderArgs, redirect, type LoaderFunction, type ActionFunction, type ActionArgs, type V2_MetaFunction } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { buildDbClient } from "~/lib/client";
import { destroyUserSession, requireUserId } from "~/lib/session.server";
import { formatDate } from "~/lib/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard - The Mug Store" },
    { name: "description", content: "User dashboard page" },
  ];
};

export const loader: LoaderFunction = async ({ request, context }: LoaderArgs): Promise<any> => {
  const userId = await requireUserId({ request, redirectTo: "/account/login" }, context);
  if (!userId || typeof userId !== "string") {
    return redirect("/account/login");
  } else {
    const db = buildDbClient(context);
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      with: {
        orders: true
      }
    });

    return {
      user,
    };
  }
}

export const action: ActionFunction = async ({ request, context }: ActionArgs): Promise<any> => {
  const userId = await requireUserId({ request, redirectTo: "/account/login" }, context);
  if (userId !== undefined) {
    return destroyUserSession(userId, "/account/login", context);
  }
}

export default function AccountDashboard() {
  const { user } = useLoaderData<typeof loader>();
  const logOutFetcher = useFetcher();

  return (
    <div className="flex flex-col min-h-screen space-x-8 space-y-8">
      <div className="flex justify-between">
        <h1 className="p-6 text-gray-600">Hello {user.firstName}!</h1>
        <logOutFetcher.Form method="post">
          <button type="submit" className="p-3">Log Out</button>
        </logOutFetcher.Form>
      </div>
      <section className="relative justify-end flex flex-col -mt-nav">
        {user.orders.length ? (
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
                {user.orders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {order.finalAmount}$
                    </td>
                    <td className="whitespace-nowrap text-center px-4 py-2">
                      {order.shippingAddress}
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
