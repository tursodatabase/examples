import type {CartItem } from "./types";

export default function cartDataAdapter (items: any): CartItem[] {
  if(items.length){
    return items.map((item: any) => ({
      count: 1,
      id: item.cart_item_id,
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        image: item.image,
        created_at: item.created_at,
      },
    }))
  }
  return []
}