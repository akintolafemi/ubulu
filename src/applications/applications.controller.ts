import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsQueryDto,
  CreateApplicationDto,
  SubmitEvaluationDto,
  SubmitScreeningDto,
} from '@dtos/application.dtos';
import { RolesGuard } from 'src/guards/roles.guards';
import { ALL_ROLES } from 'src/constants/app.constants';
import { ManageRequestSource, Roles } from 'src/decorators/roles.decorators';
import { accountType } from '@prisma/client';
import { ManageApplicationGuard } from 'src/guards/application.guards';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @ApiCreatedResponse({
    description: 'Success',
  })
  @Post(``)
  public async submitApplication(@Body() req: CreateApplicationDto) {
    return this.service.submitApplication(req);
  }

  @ApiCreatedResponse({
    description: 'Success',
  })
  @Roles([accountType.screener])
  @ManageRequestSource({ requestSource: 'body', key: 'applicationId' })
  @UseGuards(RolesGuard, ManageApplicationGuard)
  @Post(`/screen`)
  public async submitScreening(@Body() req: SubmitScreeningDto) {
    return this.service.submitScreening(req);
  }

  @ApiCreatedResponse({
    description: 'Success',
  })
  @Roles([accountType.evaluator])
  @ManageRequestSource({ requestSource: 'body', key: 'applicationId' })
  @UseGuards(RolesGuard, ManageApplicationGuard)
  @Post(`/evaluate`)
  public async submitEvaluation(@Body() req: SubmitEvaluationDto) {
    return this.service.submitEvaluation(req);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @Roles(ALL_ROLES)
  @UseGuards(RolesGuard)
  @Get(``)
  public async getApplications(@Query() req: ApplicationsQueryDto) {
    return this.service.getApplications(req);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @Roles(ALL_ROLES)
  @UseGuards(RolesGuard)
  @Get(`/:applicationId`)
  public async getApplication(@Param('applicationId') applicationId: string) {
    return this.service.getApplication(applicationId);
  }
}
