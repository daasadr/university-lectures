import { prisma } from '../prisma';

export interface ScraperConfig {
  university: string;
  faculty?: string;
}

export interface ParsedCourse {
  code: string;
  name: string;
  credits: number;
  semester: string;
  level: string;
}

export interface ParsedLecture {
  courseCode: string;
  type: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  teacher?: string;
}

export abstract class BaseScraper {
  protected prisma = prisma; // Použij existující client!
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  abstract fetchSchedules(): Promise<void>;
  
  abstract parseSchedule(data: any): Promise<{
    courses: ParsedCourse[];
    lectures: ParsedLecture[];
  }>;

  async saveToDatabase(data: {
    courses: ParsedCourse[];
    lectures: ParsedLecture[];
  }): Promise<void> {
    console.log(`💾 Saving ${data.courses.length} courses and ${data.lectures.length} lectures to DB...`);
  }

  async run(): Promise<void> {
    console.log(`🕷️  Starting scraper for ${this.config.university} ${this.config.faculty || ''}`);
    try {
      await this.fetchSchedules();
      console.log('✅ Scraper finished!');
    } catch (error) {
      console.error('❌ Scraper failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}