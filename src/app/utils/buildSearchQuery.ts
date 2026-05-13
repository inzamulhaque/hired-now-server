interface ISearchParams<TWhere> {
  page?: number;
  limit?: number;
  searchString?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: TWhere;
  searchableFields?: string[];
}

const buildSearchQuery = <TWhere>(params: ISearchParams<TWhere>) => {
  const {
    page = 1,
    limit = 3,
    searchString,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters,
    searchableFields = [],
  } = params;

  const skip = (page - 1) * limit;

  const where: TWhere & {
    AND?: unknown[];
  } = {
    AND: [
      filters || {},

      searchString && searchableFields.length > 0
        ? {
            OR: searchableFields.map((field) => ({
              [field]: {
                contains: searchString,
                mode: "insensitive",
              },
            })),
          }
        : {},
    ],
  } as TWhere & { AND?: unknown[] };

  const orderBy: unknown = {
    [sortBy]: sortOrder,
  };

  return {
    where,
    skip,
    take: limit,
    orderBy,
  };
};

export default buildSearchQuery;
