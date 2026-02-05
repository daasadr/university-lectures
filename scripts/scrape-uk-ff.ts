import { UKFFScraper } from '../src/lib/scrapers/uk-ff-scraper';

async function main() {
  console.log('🚀 Starting UK FF scraper...');
  
  const scraper = new UKFFScraper({
    university: 'Univerzita Karlova',
    faculty: 'Filozofická fakulta'
  });
  
  await scraper.run();
  
  console.log('✅ Scraping completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });




