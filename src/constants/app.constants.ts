import { accountType } from '@prisma/client';

export const DEFAULT_PAGE_LENGTH = 50;
export const DEFAULT_ORDER_BY = {
  createdAt: 'desc',
};
export const DEFAULT_PAGE = 1;

export const ALL_ROLES = [accountType.evaluator, accountType.screener];

export const SCORING_WEIGHTS = {
  problemClarity: 0.25,
  solutionFeasibility: 0.25,
  marketPotential: 0.3,
  teamCapacity: 0.2,
};
