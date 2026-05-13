import AppError from "./AppError.js";

const calTotalPages = (totalItems: number, itemsPerPage: number): number => {
  if (itemsPerPage <= 0) {
    throw new AppError("Items per page must be greater than zero!", 400);
  }
  return Math.ceil(totalItems / itemsPerPage);
};

export default calTotalPages;
