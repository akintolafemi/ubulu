import {
  ApplicationsQueryDto,
  CreateApplicationDto,
  SubmitEvaluationDto,
  SubmitScreeningDto,
} from '@dtos/application.dtos';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { applicationStatusType } from '@prisma/client';
import { filterRequestObject } from '@utils/filter.request.utils';
import { paginationRequest } from '@utils/pagination.request.utils';
import { SCORING_WEIGHTS } from 'src/constants/app.constants';
import { APPLICATIONS_FILTER_KEYS } from 'src/constants/application.constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventType } from 'src/types/event.types';
import RequestWithUser from 'src/types/request.with.user.type';
import {
  paginatedResponse,
  ResponseManager,
  standardResponse,
  StatusText,
} from 'src/types/response.manager.utils';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly dbService: PrismaService,
    @Inject(REQUEST) private request: RequestWithUser,
    private eventEmitter: EventEmitter2,
  ) {}

  async submitApplication(
    req: CreateApplicationDto,
  ): Promise<standardResponse | HttpException> {
    try {
      const data = await this.dbService.applications.create({
        data: {
          ...req,
          responses: JSON.stringify(req.responses),
        },
      });

      return ResponseManager.standardResponse({
        message: 'Application submitted successfully',
        code: HttpStatus.CREATED,
        status: StatusText.CREATED,
        data,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occurred',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getApplications(
    req: ApplicationsQueryDto,
  ): Promise<paginatedResponse | HttpException> {
    try {
      //construct pagination for list
      const { paginationReq, limit, page } = paginationRequest(req);

      //construct filter query based on request params and allowed fields
      const filter = filterRequestObject(req, APPLICATIONS_FILTER_KEYS);

      const data = await this.dbService.applications.findMany({
        where: {
          ...filter,
        },
        ...paginationReq,
      });

      const totalRecords = await this.dbService.applications.count({
        where: {
          ...filter,
        },
      });

      return ResponseManager.paginatedResponse({
        message: `Applications returned successfully`,
        status: StatusText.OK,
        code: HttpStatus.OK,
        data,
        meta: {
          currentPage: page,
          itemCount: data.length,
          itemsPerPage: limit,
          totalItems: totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occured',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getApplication(
    id: string,
  ): Promise<standardResponse | HttpException> {
    try {
      const data = await this.dbService.applications.findFirst({
        where: {
          id,
          deleted: false,
        },
        include: {
          _count: {
            select: {
              evaluations: true,
              screenings: true,
            },
          },
          evaluations: true,
          screenings: true,
        },
      });

      return ResponseManager.standardResponse({
        message: `Application returned successfully`,
        status: StatusText.OK,
        code: HttpStatus.OK,
        data,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occured',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async submitScreening(
    req: SubmitScreeningDto,
  ): Promise<standardResponse | HttpException> {
    try {
      //update application with new status
      await this.dbService.applications.update({
        where: {
          id: req.applicationId,
        },
        data: {
          status: req.status,
          updatedAt: new Date(),
        },
      });

      //save screening data
      await this.dbService.screenings.create({
        data: {
          applicationId: req.applicationId,
          comment: req.comment,
          screenerId: this.request.user.id,
          status: req.status,
        },
      });

      return ResponseManager.standardResponse({
        message: 'Screening submitted successfully',
        code: HttpStatus.CREATED,
        status: StatusText.CREATED,
        data: req,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occurred',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async submitEvaluation(
    req: SubmitEvaluationDto,
  ): Promise<standardResponse | HttpException> {
    try {
      //ensure the application is already approved
      if (this.request.application.status !== applicationStatusType.approved)
        throw new HttpException(
          `Application can not be evaluated at this time`,
          HttpStatus.BAD_REQUEST,
          {
            cause: `application`,
            description: `Application can not be evaluated at this time`,
          },
        );

      //calculate weighted score
      const weightedScore =
        req.marketPotential * SCORING_WEIGHTS.marketPotential +
        req.problemClarity * SCORING_WEIGHTS.problemClarity +
        req.solutionFeasibility * SCORING_WEIGHTS.solutionFeasibility +
        req.teamCapacity * SCORING_WEIGHTS.teamCapacity;

      await this.dbService.evaluations.create({
        data: {
          applicationId: req.applicationId,
          comment: req.comment,
          evaluatorId: this.request.user.id,
          marketPotential: req.marketPotential,
          problemClarity: req.problemClarity,
          solutionFeasibility: req.solutionFeasibility,
          teamCapacity: req.teamCapacity,
          weightedScore,
        },
      });

      //dispatch an event to update the average final score for the application
      this.eventEmitter.emit(
        EventType.APPLICATION_EVALUATED,
        req.applicationId,
      );

      return ResponseManager.standardResponse({
        message: 'Evaluation submitted successfully',
        code: HttpStatus.CREATED,
        status: StatusText.CREATED,
        data: req,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error?.response || 'Unknown error has occurred',
          status: StatusText.ERROR,
          code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
        },
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
