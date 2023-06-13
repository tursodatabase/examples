import { resizeImage } from "~/lib/resizeImage";
import type { Product } from "~/lib/types";

export interface ProductCardProps {
  product: Product;
}

export const ProductCard = (props: ProductCardProps) => {
  return (
    <div className="group relative block overflow-hidden">
      <a
        href={`/mug/${props.product.id}`}
        className="group relative block overflow-hidden"
      >
        <img
          src={resizeImage(props.product.image, 400, 320)}
          alt=""
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
        />
      </a>

      <div className="relative border border-gray-100 bg-white py-2">
        <a
          href={`/mug/${props.product.id}`}
          className="group relative block overflow-hidden"
        >
          <h3 className="mt-4 text-lg text-gray-900">{props.product.name}</h3>
        </a>

        <p className="mt-1.5 text-sm text-gray-700">${props.product.price}</p>
      </div>
    </div>
  );
};
