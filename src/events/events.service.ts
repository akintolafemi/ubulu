import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { OnEvent } from '@nestjs/event-emitter';
import { EventType } from 'src/types/event.types';

@Injectable()
export class EventsService {
  constructor(private readonly dbService: PrismaService) {}

  @OnEvent(EventType.APPLICATION_EVALUATED)
  async setLoginAudit(applicationId: string) {
    try {
      //get average weighted score for application
      const average = await this.dbService.evaluations.aggregate({
        where: {
          applicationId,
          deleted: false,
        },
        _avg: {
          weightedScore: true,
        },
      });
      //update application with new average score
      await this.dbService.applications.update({
        where: {
          id: applicationId,
        },
        data: {
          finalScore: average._avg.weightedScore,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
