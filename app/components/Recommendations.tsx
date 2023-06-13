import type { Product } from "~/lib/types";
import { ProductCard } from "~/components/ProductCard";

interface RecommendationsProps {
  recommendations: Product[];
}

export const Recommendations = (props: RecommendationsProps) => {
  return (
    <>
      <h3 className="text-xl">Recommended</h3>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {props.recommendations.map((product: Product) => (
          <ProductCard {...{ product }} key={product.id} />
        ))}
      </ul>
    </>
  );
};
