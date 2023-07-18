import { useFetcher } from "@remix-run/react";

import type { CartItem } from "~/lib/types";
import { DeleteIcon, LoadingIcon } from "./Icon";
import { resizeImage } from "~/lib/utils";

export const CartListItem = (props: CartItem) => {
  const itemFetcher = useFetcher();

  return (
    <div className="flex w-full items-center p-4 gap-4">
      <img
        src={resizeImage(props.product.image, 50, 50)}
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
                <LoadingIcon />
              </span>
            ) : (
              <DeleteIcon />
            )}
          </button>
        </itemFetcher.Form>
      </div>
    </div>
  );
};
