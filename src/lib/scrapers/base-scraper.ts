export abstract class BaseScraper {
    abstract source: string;
    abstract baseUrl: string;
    
    abstract fetchSchedules(): Promise<RawScheduleData[]>;
    abstract parseSchedule(raw: RawScheduleData): ParsedSchedule;
    abstract saveToDatabase(schedule: ParsedSchedule): Promise<void>;
    
    async run() {
      const job = await this.createScrapingJob();
      try {
        const raw = await this.fetchSchedules();
        for (const item of raw) {
          const parsed = await this.parseSchedule(item);
          await this.saveToDatabase(parsed);
          await this.updateJobProgress(job.id);
        }
        await this.completeJob(job.id);
      } catch (error) {
        await this.failJob(job.id, error);
      }
    }
  }
  
  // src/lib/scrapers/uk-ff-scraper.ts
  
  export class UKFFScraper extends BaseScraper {
    source = "UK-FF";
    baseUrl = "https://rozvrhy.ff.cuni.cz";
    
    async fetchSchedules() {
      // Stáhni seznam všech rozvrhů
      const response = await fetch(`${this.baseUrl}/api/schedules`);
      const schedules = await response.json();
      
      // Pro každý rozvrh stáhni XLS/PDF
      return Promise.all(
        schedules.map(s => this.fetchScheduleDetails(s.id))
      );
    }
    
    async parseSchedule(raw: RawScheduleData) {
      // Parse XLS/PDF → strukturovaná data
      // Použij knihovny jako xlsx, pdf-parse
      // Extrahuj: čas, místnost, učitel, předmět
    }
    
    async saveToDatabase(schedule: ParsedSchedule) {
      // Upsert do PostgreSQL přes Prisma
      await prisma.course.upsert({
        where: { facultyId_code: { facultyId: "...", code: schedule.code } },
        update: { ...schedule },
        create: { ...schedule }
      });
    }
  }