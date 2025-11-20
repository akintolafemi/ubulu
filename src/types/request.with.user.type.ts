import { applications, users } from '@prisma/client';

type RequestWithUser = Request & {
  user: users;
  application?: applications;
};

export default RequestWithUser;
