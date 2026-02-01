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
   * Krok 1: Najdi všechny programy (85 celkem)
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
        // Hledáme odkazy na /ft/detail/{ID}
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

      // Pro test - zpracuj jen první program
      if (programs.length > 0) {
        console.log(`\n📥 Processing first program: ${programs[0].name}`);
        await this.processProgram(programs[0]);
      }

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

      // Najdi tabulku s rozvrhem
      const table = $('table');
      console.log(`📊 Found ${table.length} tables`);

      // Základní info o programu
      const obor = $('.rozvrh-detail').text().trim();
      const aktualizace = $('td:contains("Aktualizace:")').next().text().trim();
      const semestr = $('td:contains("Semestr:")').next().text().trim();

      console.log('\n📋 Program info:');
      console.log(`  Obor: ${obor}`);
      console.log(`  Aktualizace: ${aktualizace}`);
      console.log(`  Semestr: ${semestr}`);

      // Parsuj tabulku
      const parsed = await this.parseSchedule({ $, program });

      console.log(`\n✅ Parsed:`);
      console.log(`  - ${parsed.courses.length} courses`);
      console.log(`  - ${parsed.lectures.length} lectures`);

      // Výpis prvních 3 přednášek
      console.log('\n📚 First 3 lectures:');
      parsed.lectures.slice(0, 3).forEach((lecture, i) => {
        console.log(`  ${i + 1}. ${lecture.courseCode}: ${lecture.type} - ${lecture.dayOfWeek} ${lecture.startTime}-${lecture.endTime} ${lecture.room || ''}`);
      });

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
            courseCode: program.id, // Zatím použijeme ID programu
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
   * Helper: Parsuj den v týdnu
   */
  private parseDayOfWeek(text: string): number {
    const dayMap: Record<string, number> = {
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