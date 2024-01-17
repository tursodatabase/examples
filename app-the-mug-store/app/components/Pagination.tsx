export interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export const Pagination = (props: PaginationProps) => {
  const back = (offset: number) => {
    return props.currentPage - offset > 1
      ? `/mugs/${props.currentPage - offset}`
      : `/mugs`;
  };

  const forward = (offset: number) => {
    return props.currentPage + offset < props.totalPages
      ? `/mugs/${props.currentPage + offset}`
      : `/mugs/${props.totalPages}`;
  };

  return (
    <ol className="mt-8 flex justify-center gap-1 text-xs font-medium">
      {props.currentPage - 1 > 0 && (
        <li>
          <a
            href={back(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
          >
            <span className="sr-only">Prev Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>
      )}

      {props.currentPage - 2 > 0 && (
        <li>
          <a
            href={back(2)}
            className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
          >
            {props.currentPage - 2}
          </a>
        </li>
      )}

      {props.currentPage - 1 > 0 && (
        <li>
          <a
            href={back(1)}
            className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
          >
            {props.currentPage - 1}
          </a>
        </li>
      )}

      <li className="block h-8 w-8 rounded border-black bg-black text-center leading-8 text-white">
        {props.currentPage || props.currentPage + 1}
      </li>

      {props.currentPage + 1 < props.totalPages && (
        <li>
          <a
            href={forward(1)}
            className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
          >
            {props.currentPage + 1}
          </a>
        </li>
      )}

      {props.currentPage + 2 <= props.totalPages &&
        props.currentPage + 2 > 2 && (
          <li>
            <a
              href={forward(2)}
              className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
            >
              {props.currentPage + 2}
            </a>
          </li>
        )}

      {props.currentPage + 1 < props.totalPages && (
        <li>
          <a
            href={forward(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
          >
            <span className="sr-only">Next Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>
      )}
    </ol>
  );
};
