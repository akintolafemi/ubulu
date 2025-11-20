import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from './pagination.dtos';
import { APPLICATION_STATUSES } from 'src/constants/application.constants';
import {
  IsObjectId,
  TransformToMongooseInArrayFromEnum,
} from '@transformers/query.transformers';
import { applicationStatusType } from '@prisma/client';

class ResponsesDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  response: string;
}

export class CreateApplicationDto {
  @ApiProperty({
    name: 'fullName',
    description: "Applicant's full name",
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    name: 'email',
    description: "Applicant's email address",
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'programName',
    description: 'Program applicant is applying for',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty({
    name: 'responses',
    description:
      'JSON Array with each object having question and response. E.g: [{question: "", answer: "}]',
    type: [ResponsesDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Type(() => ResponsesDto)
  responses: ResponsesDto[];
}

export class ApplicationsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    name: 'status',
    description: 'application status. Also accepts comma separated statuses.',
    type: 'string',
    enum: APPLICATION_STATUSES,
  })
  @IsOptional()
  @Transform(({ value }) =>
    TransformToMongooseInArrayFromEnum(value, 'status', APPLICATION_STATUSES),
  )
  status: string;
}

class ScreeningDto {
  @ApiProperty({
    name: 'applicationId',
    description: 'Id of application',
    type: 'string',
  })
  @IsObjectId()
  @IsNotEmpty()
  applicationId: string;

  @ApiProperty({
    name: 'comment',
    description: 'Screening comment',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class SubmitScreeningDto extends ScreeningDto {
  @ApiProperty({
    name: 'status',
    description: 'Status to update to',
    type: 'string',
    enum: APPLICATION_STATUSES,
  })
  @IsEnum(APPLICATION_STATUSES, {
    message: `status must be one of ${APPLICATION_STATUSES.toString()}`,
  })
  @IsNotEmpty()
  status: applicationStatusType;
}

export class SubmitEvaluationDto extends ScreeningDto {
  @ApiProperty({
    name: 'problemClarity',
    description: 'Problem clarity score',
    type: 'integer',
  })
  @IsInt()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  problemClarity: number;

  @ApiProperty({
    name: 'solutionFeasibility',
    description: 'Solution feasibility score',
    type: 'integer',
  })
  @IsInt()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  solutionFeasibility: number;

  @ApiProperty({
    name: 'marketPotential',
    description: 'Market potential score',
    type: 'integer',
  })
  @IsInt()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  marketPotential: number;

  @ApiProperty({
    name: 'teamCapacity',
    description: 'Team capacity score',
    type: 'integer',
  })
  @IsInt()
  @Max(5)
  @Min(0)
  @IsNotEmpty()
  teamCapacity: number;
}
