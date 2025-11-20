import { PaginationDto } from '@dtos/pagination.dtos';
import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LENGTH,
} from 'src/constants/app.constants';

export const paginationRequest = (request: PaginationDto, order?: any) => {
  const limit = Number(request.limit) || DEFAULT_PAGE_LENGTH;
  const page = Number(request.page) || DEFAULT_PAGE;
  return {
    paginationReq: {
      skip: (page - DEFAULT_PAGE) * limit || 0,
      take: limit,
      orderBy: request?.order
        ? request?.order
        : order
          ? order
          : DEFAULT_ORDER_BY,
    },
    limit: limit || DEFAULT_PAGE_LENGTH,
    page: page || DEFAULT_PAGE,
  };
};
