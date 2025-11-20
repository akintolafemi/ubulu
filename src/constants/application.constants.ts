import { applicationStatusType } from '@prisma/client';

export const APPLICATION_STATUSES = [
  applicationStatusType.approved,
  applicationStatusType.needs_clarification,
  applicationStatusType.pending,
  applicationStatusType.rejected,
];

export const APPLICATIONS_FILTER_KEYS = ['status'];
