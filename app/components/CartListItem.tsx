import { useFetcher } from "@remix-run/react";

import type { CartItem } from "~/lib/types";

export const CartListItem = (props: CartItem) => {
  const itemFetcher = useFetcher();

  return (
    <div className="flex w-full items-center p-4 gap-4">
      <img
        src={props.product.image || "Default image url"}
        alt=""
        className="h-16 w-16 rounded object-cover"
      />

      <div className=" flex-1">
        <h3 className="text-sm text-gray-900">
          {props.product.name} <strong>x({props.count})</strong>
        </h3>
      </div>
      <div>
        <itemFetcher.Form method="post" action="/manage-cart">
          <input type="hidden" name="product_id" value={props.product.id} />
          <button
            className="p-1 rounded bg-red-600 text-white"
            name="_action"
            value="deleteCartItem"
          >
            {(itemFetcher.state === "submitting" ||
              itemFetcher.state === "loading") &&
              itemFetcher.formData?.get("product_id") === props.product.id ? (
              <span className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="animate-spin text-white w-4 h-4 fill-white"
                >
                  <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"></path>
                </svg>
              </span>
            ) : (
              <svg
                className="h-4 w-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
              </svg>
            )}
          </button>
        </itemFetcher.Form>
      </div>
    </div>
  );
};
