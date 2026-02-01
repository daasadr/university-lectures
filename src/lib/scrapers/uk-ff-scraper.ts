import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseScraper, ParsedCourse, ParsedLecture } from './base-scraper';

interface Program {
  id: string;
  name: string;
  detailUrl: string;
  xlsUrl: string;
}

export class UKFFScraper extends BaseScraper {
  private baseUrl = 'https://rozvrhy.ff.cuni.cz';

  /**
   * Krok 1: Najdi všechny programy (100 celkem)
   */
  async fetchSchedules(): Promise<void> {
    console.log('📡 Fetching programs from UK FF...');

    try {
      const programs: Program[] = [];

      // Projdi všechny 4 stránky
      for (let page = 1; page <= 4; page++) {
        console.log(`\n📄 Fetching page ${page}/4...`);
        
        const url = page === 1 
          ? `${this.baseUrl}/` 
          : `${this.baseUrl}/?page=${page}`;
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Najdi všechny programy na stránce
        $('a[href*="/ft/detail/"]').each((_, element) => {
          const href = $(element).attr('href');
          const text = $(element).text().trim();

          if (href) {
            const match = href.match(/\/ft\/detail\/(\d+)/);
            if (match) {
              const id = match[1];
              programs.push({
                id,
                name: text,
                detailUrl: `${this.baseUrl}/ft/detail/${id}`,
                xlsUrl: `${this.baseUrl}/export/xls/${id}`,
              });
            }
          }
        });
      }

      console.log(`\n✅ Found ${programs.length} programs!`);

      // Zpracuj všechny programy!
console.log(`\n🔄 Processing all ${programs.length} programs...`);
for (let i = 0; i < programs.length; i++) {
  console.log(`\n📥 [${i + 1}/${programs.length}] Processing: ${programs[i].name}`);
  await this.processProgram(programs[i]);
  
  // Pauza mezi požadavky (1 sekunda)
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log(`\n🎉 FINISHED! Processed ${programs.length} programs!`);

      // TODO: Později zpracuj všechny programy
      // for (let i = 0; i < Math.min(10, programs.length); i++) {
      //   console.log(`\n📥 [${i + 1}/${programs.length}] Processing: ${programs[i].name}`);
      //   await this.processProgram(programs[i]);
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }

    } catch (error) {
      console.error('❌ Error fetching schedules:', error);
      throw error;
    }
  }

  /**
   * Krok 2: Zpracuj jeden program (stáhni HTML detail)
   */
  async processProgram(program: Program): Promise<void> {
    try {
      console.log(`\n📥 Fetching: ${program.detailUrl}`);

      const response = await axios.get(program.detailUrl);
      const $ = cheerio.load(response.data);

      console.log('✅ Page loaded');

      // Parsuj tabulku
      const parsed = await this.parseSchedule({ $, program });

      console.log(`\n✅ Parsed:`);
      console.log(`  - ${parsed.courses.length} courses`);
      console.log(`  - ${parsed.lectures.length} lectures`);

      // Výpis prvních 3 přednášek
      if (parsed.lectures.length > 0) {
        console.log('\n📚 First 3 lectures:');
        parsed.lectures.slice(0, 3).forEach((lecture, i) => {
          console.log(`  ${i + 1}. ${lecture.courseCode}: ${lecture.type} - ${lecture.dayOfWeek} ${lecture.startTime}-${lecture.endTime} ${lecture.room || ''}`);
        });

        // 💾 Ulož do databáze!
        await this.saveToDatabase(parsed, program);
      }

    } catch (error) {
      console.error('❌ Error processing program:', error);
    }
  }

  /**
   * Krok 3: Parsuj HTML tabulku
   */
  async parseSchedule(data: { $: cheerio.CheerioAPI; program: Program }): Promise<{
    courses: ParsedCourse[];
    lectures: ParsedLecture[];
  }> {
    const $ = data.$;
    const program = data.program;
    
    const courses: ParsedCourse[] = [];
    const lectures: ParsedLecture[] = [];

    // Najdi všechny řádky tabulky
    $('table tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');

      if (cells.length >= 5) {
        // Název předmětu
        const courseName = $(cells[0]).text().trim();
        
        // Den (Út/Tue, St/Wed, atd.)
        const dayText = $(cells[1]).text().trim();
        
        // Čas (10:50 - 12:25)
        const timeText = $(cells[2]).text().trim();
        
        // Místnost (C143A)
        const room = $(cells[3]).text().trim();
        
        // Vyučující
        const teacher = $(cells[4]).text().trim();

        // Parsuj den
        const dayOfWeek = this.parseDayOfWeek(dayText);
        
        // Parsuj čas
        const times = this.parseTime(timeText);

        if (courseName && dayOfWeek && times) {
          // Typ přednášky
          const type = courseName.includes('Seminář') || courseName.includes('Seminar') 
            ? 'SEMINAR' 
            : courseName.includes('Přednáška') || courseName.includes('Lecture')
            ? 'LECTURE'
            : 'OTHER';

          lectures.push({
            courseCode: program.id,
            type,
            dayOfWeek,
            startTime: times.start,
            endTime: times.end,
            room: room || undefined,
            teacher: teacher || undefined,
          });
        }
      }
    });

    return { courses, lectures };
  }

  /**
   * Krok 4: Ulož do databáze
   */
  async saveToDatabase(
    parsed: { courses: ParsedCourse[]; lectures: ParsedLecture[] },
    program: Program
  ): Promise<void> {
    console.log('\n💾 Saving to database...');
  
    try {
      // 1. Najdi nebo vytvoř UK
      let university = await this.prisma.university.findFirst({
        where: { shortName: 'UK' }
      });
      
      if (!university) {
        university = await this.prisma.university.create({
          data: {
            name: 'Univerzita Karlova',
            shortName: 'UK',
            website: 'https://cuni.cz',
          }
        });
      }
  
      // 2. Najdi nebo vytvoř FF
      let faculty = await this.prisma.faculty.findFirst({
        where: {
          universityId: university.id,
          shortName: 'FF'
        }
      });
  
      if (!faculty) {
        faculty = await this.prisma.faculty.create({
          data: {
            name: 'Filozofická fakulta',
            shortName: 'FF',
            universityId: university.id,
          }
        });
      }
  
      // 3. Vytvoř kurz
      const course = await this.prisma.course.create({
        data: {
          code: `UK-FF-${program.id}`,
          name: program.name,
          credits: 5,
          semester: 'ZS',
          level: 'BC',
          facultyId: faculty.id,
        },
      });
  
      console.log(`✅ Created course: ${course.name}`);
  
      // 4. Vytvoř přednášky
      let savedCount = 0;
      for (const lecture of parsed.lectures) {
        let room = null;
        
        if (lecture.room) {
          // Najdi nebo vytvoř budovu
          let building = await this.prisma.building.findFirst({
            where: { name: 'Hlavní budova FF UK' }
          });
  
          if (!building) {
            building = await this.prisma.building.create({
              data: {
                name: 'Hlavní budova FF UK',
                address: 'náměstí Jana Palacha 1/2, Praha 1',
              }
            });
          }
  
          // Najdi nebo vytvoř místnost
          room = await this.prisma.room.findFirst({
            where: {
              buildingId: building.id,
              number: lecture.room
            }
          });
  
          if (!room) {
            room = await this.prisma.room.create({
              data: {
                number: lecture.room,
                buildingId: building.id,
              }
            });
          }
        }
  
        // Vytvoř přednášku
        await this.prisma.lecture.create({
          data: {
            courseId: course.id,
            type: lecture.type,
            dayOfWeek: lecture.dayOfWeek,
            startTime: lecture.startTime,
            endTime: lecture.endTime,
            roomId: room?.id,
          },
        });
  
        savedCount++;
      }
  
      console.log(`✅ Saved ${savedCount} lectures to database!`);
  
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      throw error;
    }
  }

  /**
   * Helper: Parsuj den v týdnu
   */
  private parseDayOfWeek(text: string): number {
    const dayMap: Record<string, number> = {
      'Po': 1, 'Mon': 1, 'Monday': 1,
      'Út': 2, 'Tue': 2, 'Tuesday': 2,
      'St': 3, 'Wed': 3, 'Wednesday': 3,
      'Čt': 4, 'Thu': 4, 'Thursday': 4,
      'Pá': 5, 'Fri': 5, 'Friday': 5,
    };

    for (const [key, value] of Object.entries(dayMap)) {
      if (text.includes(key)) return value;
    }

    return 0;
  }

  /**
   * Helper: Parsuj čas (10:50 - 12:25)
   */
  private parseTime(text: string): { start: string; end: string } | null {
    const match = text.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (match) {
      return {
        start: `${match[1].padStart(2, '0')}:${match[2]}`,
        end: `${match[3].padStart(2, '0')}:${match[4]}`,
      };
    }
    return null;
  }
}