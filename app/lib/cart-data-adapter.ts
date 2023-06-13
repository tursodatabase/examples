import type { CartItem } from "./types";

export default function cartDataAdapter(items: any): CartItem[] {
  if (items.length) {
    return items.map((item: any) => ({
      count: item.count,
      id: item.cart_item_id,
      product: Object.assign(item.products, {
        id: item.products.id,
        name: item.products.name,
        description: item.products.description,
        price: item.products.price,
        category_id: item.products.category_id,
        image: item.products.image,
        created_at: item.products.created_at,
      }),
    }));
  }
  return [];
}
