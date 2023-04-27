import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Pagination, type PaginationProps } from '~/components/pagination/Pagination';
import { ProductCard } from '~/components/product-card/ProductCard';
import { ITEMS_PER_PAGE } from '~/utils/constants';
import { responseDataAdapter } from '~/utils/response-adapter';
import { client } from '~/utils/turso-db';
import type { Product } from '~/utils/types';

export interface CategoryPageResponse {
  status?: string;
  products?: Product[];
  pageInfo: PaginationProps;
  categoryName: string;
}

export const useCategoryLoader = routeLoader$(async ({params, fail}): Promise<CategoryPageResponse> => {
  const [categoryId, pageNum] = params.all.split("/");
  let currentPage = 1, offset = 0;

  if(!categoryId){
    fail(404, {
      errorMessage: "Category id not provided"
    })
  }

  if(pageNum !== undefined){
    currentPage = parseInt(pageNum);
    offset = currentPage > 1 ? currentPage * ITEMS_PER_PAGE : 0;
  }

  try {
    const categoryData = await client.execute({
      sql: "select name from categories where id = ?",
      args: [categoryId]}
    )
    if(categoryData.rows.length === 0){
      fail(404, {
        errorMessage: "Category does not exist"
      })
    }
  
    const totalItems = await client.execute({
      sql: "select count (*) from products where category_id = ?",
      args: [categoryId]
    });
  
    const itemsCount = totalItems["rows"][0]["count (*)"];
    const totalPages = Math.ceil(itemsCount as number / ITEMS_PER_PAGE)
  
    // get data from db
    const categoryResults = await client.execute({
      sql: "select * from products where category_id = ? limit ? offset ?",
      args: [categoryId, ITEMS_PER_PAGE, offset]
    })
  
    return {
      status: "success",
      products: responseDataAdapter(categoryResults),
      pageInfo: {
        totalPages,
        currentPage, 
        categoryId
      },
      categoryName: responseDataAdapter(categoryData)[0]["name"]
    }
  } catch (error) {
    console.log(error)
  }
  return {
    pageInfo: {
      totalPages: 0,
      categoryId: "",
      currentPage: 0
    },
    categoryName: ""
  }
});

export default component$(() => {
  const pageData = useCategoryLoader();
  
  return (
    <>
      { !pageData.value.products
        ? <div class="p-8">{pageData.value.status}</div>
        : <section>
            <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <header>
                <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">
                  {pageData.value.categoryName || ""} Collection
                </h2>
      
                <p class="mt-4 max-w-md text-gray-500">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
                  praesentium cumque iure dicta incidunt est ipsam, officia dolor fugit
                  natus?
                </p>
              </header>

              <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {
                  pageData.value.products.length > 0
                  ? pageData.value.products.map((product: Product) => (<ProductCard product={product} key={product.id} />))
                  : <div class="p-8">No items</div>
                }
              </ul>
      
              <Pagination {...pageData.value.pageInfo} />
            </div>
          </section>
      }
    </>
  )
});