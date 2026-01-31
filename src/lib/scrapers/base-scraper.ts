import { PrismaClient } from '@prisma/client';
import type { RawScheduleData, ParsedSchedule } from '@/types';

const prisma = new PrismaClient();

export abstract class BaseScraper {
  abstract source: string;
  abstract baseUrl: string;

  abstract fetchSchedules(): Promise<RawScheduleData[]>;
  abstract parseSchedule(raw: RawScheduleData): Promise<ParsedSchedule>;

  async run() {
    console.log(`Starting scraper: ${this.source}`);

    const job = await this.createScrapingJob();

    try {
      const rawData = await this.fetchSchedules();
      console.log(`Fetched ${rawData.length} schedules`);

      for (const raw of rawData) {
        try {
          const parsed = await this.parseSchedule(raw);
          await this.saveToDatabase(parsed);
          await this.updateJobProgress(job.id, 1);
        } catch (error) {
          console.error(`Error processing schedule:`, error);
          await this.logJobError(job.id, error);
        }
      }

      await this.completeJob(job.id);
      console.log(`Scraping completed successfully`);
    } catch (error) {
      console.error(`Scraping failed:`, error);
      await this.failJob(job.id, error);
      throw error;
    }
  }

  async saveToDatabase(schedule: ParsedSchedule) {
    // Save courses
    for (const course of schedule.courses) {
      await prisma.course.upsert({
        where: {
          facultyId_code: {
            facultyId: course.facultyId!,
            code: course.code!,
          },
        },
        update: course,
        create: course as any,
      });
    }

    // Save teachers
    for (const teacher of schedule.teachers) {
      await prisma.teacher.upsert({
        where: {
          // Assuming we use name as unique identifier
          name: teacher.name!,
        },
        update: teacher,
        create: teacher as any,
      });
    }

    // Save rooms
    for (const room of schedule.rooms) {
      await prisma.room.upsert({
        where: {
          buildingId_number: {
            buildingId: room.buildingId!,
            number: room.number!,
          },
        },
        update: room,
        create: room as any,
      });
    }

    // Save lectures
    for (const lecture of schedule.lectures) {
      await prisma.lecture.create({
        data: lecture as any,
      });
    }
  }

  private async createScrapingJob() {
    return await prisma.scrapingJob.create({
      data: {
        source: this.source,
        status: 'running',
        startedAt: new Date(),
        recordsProcessed: 0,
      },
    });
  }

  private async updateJobProgress(jobId: string, increment: number) {
    await prisma.scrapingJob.update({
      where: { id: jobId },
      data: {
        recordsProcessed: {
          increment,
        },
      },
    });
  }

  private async logJobError(jobId: string, error: any) {
    await prisma.scrapingJob.update({
      where: { id: jobId },
      data: {
        errors: {
          push: {
            timestamp: new Date(),
            message: error.message,
            stack: error.stack,
          },
        },
      },
    });
  }

  private async completeJob(jobId: string) {
    await prisma.scrapingJob.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  private async failJob(jobId: string, error: any) {
    await prisma.scrapingJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        completedAt: new Date(),
        logs: error.message,
      },
    });
  }
}
  
