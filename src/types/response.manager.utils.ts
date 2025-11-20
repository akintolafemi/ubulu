export enum StatusText {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  ERROR = 'Error',
  BAD_REQUEST = 'Bad request',
  CREATED = 'Created',
  UNAUTHORIZED = 'Unauthorized',
  OK = 'Ok',
  ACCEPTED = 'Accepted',
  FORBIDDEN = 'Forbidden',
  CONFLICT = 'Conflict',
  PENDING = 'Pending verification',
  NOT_FOUND = 'Not found',
}

export type statusTextValue = (typeof StatusText)[keyof typeof StatusText];

export enum HttpExceptionMessage {
  UNKNOWN = 'Unknown error has occured',
}

export type paginatedResponse = standardResponse & {
  meta?: meta;
  extradata?: any;
};

export type standardResponse = {
  code: number;
  status: statusTextValue;
  message: string;
  data?: Array<Record<any, any>> | Record<any, any> | null;
};

export type meta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export class ResponseManager {
  static standardResponse(response: standardResponse) {
    return response;
  }

  public static paginatedResponse(response: paginatedResponse) {
    return response;
  }
}
