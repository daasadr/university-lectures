import { UKFFScraper } from '../src/lib/scrapers/uk-ff-scraper';

async function main() {
  console.log('🚀 Starting UK FF Scraper Test\n');

  const scraper = new UKFFScraper({
    university: 'UK',
    faculty: 'FF',
  });

  await scraper.run();
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));