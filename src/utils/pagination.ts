type PaginationUrls = {
  prev: string | null;
  next: string | null;
};

export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  lastPage: number;
  url: PaginationUrls;
};

type PaginateItemsOptions = {
  pageNumber: number;
  pageSize: number;
  basePath: string;
};

export function parsePageNumber(rawPageNumber: string | undefined): number | null {
  const pageNumber = Number.parseInt(rawPageNumber ?? '1', 10);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return null;
  }

  return pageNumber;
}

export function paginateItems<T>(
  items: T[],
  { pageNumber, pageSize, basePath }: PaginateItemsOptions,
): PaginationResult<T> | null {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  if (pageNumber > lastPage) {
    return null;
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage: pageNumber,
    lastPage,
    url: {
      prev: pageNumber > 1 ? `${basePath}/page/${pageNumber - 1}` : null,
      next: pageNumber < lastPage ? `${basePath}/page/${pageNumber + 1}` : null,
    },
  };
}
