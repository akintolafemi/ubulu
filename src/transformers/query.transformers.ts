import { HttpException, HttpStatus } from '@nestjs/common';
import { IsNumeric } from './number.transform';
import { isValidObjectId } from 'mongoose';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isValidObjectId(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        },
      },
    });
  };
}

export const TransformToMongooseOrderBy = (
  value: string,
  fieldName: string,
) => {
  if (IsNumeric(Number(value))) {
    throw new HttpException(
      {
        message: `Query param ${fieldName} can not be a number`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  if (typeof value !== 'string') {
    throw new HttpException(
      {
        message: `Query param ${fieldName} must be a string`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const arr = value.split(',');
  const field = arr[0].trim();
  const order = arr.length > 1 ? arr[1].trim() : 'desc';
  if (order !== 'asc' && order !== 'desc') {
    throw new HttpException(
      {
        message: `Query param ${fieldName} value must be one of 'asc' or 'desc'`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return {
    [field]: order.toLocaleLowerCase(),
  };
};

export const TransformToMongooseArrayNotEmpty = (
  value: string,
  fieldName: string,
) => {
  if (!IsNumeric(Number(value))) {
    throw new HttpException(
      {
        message: `Query param ${fieldName} is invalid`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  if (Number(value) !== 0 && Number(value) !== 1) {
    throw new HttpException(
      {
        message: `Query param ${fieldName} must be 0 or 1`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  return Number(value) === 0
    ? {
        isEmpty: true,
      }
    : {
        isEmpty: false,
      };
};

export const TransformToMongooseInArray = (
  value: string,
  fieldName: string,
) => {
  if (IsNumeric(Number(value)) || typeof value !== 'string') {
    throw new HttpException(
      {
        message: `Query param ${fieldName} is invalid`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const arr = value.split(',');

  if (arr.length <= 0) {
    throw new HttpException(
      {
        message: `Query param ${fieldName} is invalid`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const trimArr = arr.map((a) => {
    return a.trim();
  });

  return {
    in: trimArr,
  };
};

export const TransformToMongooseInArrayFromEnum = (
  value: string,
  fieldName: string,
  enums: any[],
) => {
  if (IsNumeric(Number(value)) || typeof value !== 'string') {
    throw new HttpException(
      {
        message: `Query param ${fieldName} is invalid`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const arr = value.split(',');

  if (arr.length <= 0) {
    throw new HttpException(
      {
        message: `Query param ${fieldName} is invalid`,
        statusText: 'error',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  for (const _arr of arr) {
    if (!enums.includes(_arr.trim())) {
      throw new HttpException(
        {
          message: `Query param ${fieldName} is invalid, all values must be one of ${enums}`,
          statusText: 'error',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  const trimArr = arr.map((a) => {
    return a.trim();
  });

  return {
    in: trimArr,
  };
};
