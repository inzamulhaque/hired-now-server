export interface ISearchParams {
  page?: number;
  limit?: number;
  searchText?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
  searchableFields?: string[];
}

const buildSearchQuery = <TWhere, TOrderBy>(params: ISearchParams) => {
  const {
    page = 1,
    limit = 3,
    searchText,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters,
    searchableFields = [],
  } = params;

  const skip = (page - 1) * limit;

  const where: TWhere = {
    AND: [
      filters || {},

      searchText && searchableFields.length > 0
        ? {
            OR: searchableFields.map((field) => ({
              [field]: {
                contains: searchText,
                mode: "insensitive",
              },
            })),
          }
        : {},
    ],
  } as TWhere;

  const orderBy = {
    [sortBy]: sortOrder,
  } as TOrderBy;

  return {
    page,
    where,
    skip,
    take: limit,
    orderBy,
  };
};

export default buildSearchQuery;
