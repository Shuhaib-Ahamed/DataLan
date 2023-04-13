export const getPagination = (page, size) => {
  const defaultSize = 10;
  const limit = size ? +size : defaultSize;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: result } = data;
  const currentPage = page ? +page : 1;
  return {
    totalItems,
    result,
    itemsPerPage: limit,
    currentPage
  };
};
