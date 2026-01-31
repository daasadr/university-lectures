🎓 Univerzitní Přednášky

Demokratizace přístupu k vysokoškolskému vzdělání v České republice

Webová platforma pro vyhledávání a sledování veřejně přístupných univerzitních přednášek v České republice. Naším cílem je zpřístupnit vysokoškolské vzdělání každému, bez ohledu na věk nebo ekonomické zázemí.
📋 Obsah

O projektu
Funkce
Tech Stack
Quick Start
Instalace
Vývoj
Deployment
Roadmap
Přispívání
Licence

🎯 O projektu
Univerzitní přednášky jsou často veřejně přístupné, ale informace o nich (čas, místo, učebna) jsou roztroušené a těžko dostupné. Tento projekt řeší tento problém tím, že:

📚 Agreguje rozvrhy přednášek z různých českých univerzit
🔍 Umožňuje snadné vyhledávání podle předmětu, oboru, univerzity
📅 Poskytuje osobní rozvrh s upozorněními
🌐 Zpřístupňuje vzdělání širší veřejnosti zdarma
🤝 Je open-source a neziskový

🎓 Podporované univerzity
Aktuálně (MVP):

✅ Univerzita Karlova - Filozofická fakulta (UK FF)
🚧 Univerzita Karlova - Přírodovědecká fakulta (UK PřF) - v plánu

V plánu:

⏳ České vysoké učení technické (ČVUT)
⏳ Masarykova univerzita (MUNI)
⏳ Univerzita Palackého v Olomouci (UP)

✨ Funkce
✅ Hotové (MVP)

🏠 Homepage s hero section a přehledem funkcí
🔍 Vyhledávací interface (UI komponenty)
📅 Týdenní kalendářní zobrazení rozvrhu
🎨 Responzivní design s Tailwind CSS
🐳 Docker setup pro production deployment
📊 Kompletní database schema (Prisma)

🚧 V implementaci

🕷️ UK FF web scraper (XLS/PDF parsing)
🔐 Autentifikace uživatelů (NextAuth.js)
📧 Email notifikace
💾 Ukládání osobních rozvrhů

📅 Plánované

📱 Mobilní aplikace (React Native/Flutter)
🔔 Push notifikace
🤖 AI doporučení přednášek
📤 Export do Google Calendar, iCal, PDF
💬 Komunitní funkce (hodnocení, komentáře)
🎮 Gamifikace (badges za návštěvnost)

🛠️ Tech Stack
Frontend

Framework: Next.js 15 (App Router)
Language: TypeScript 5
Styling: Tailwind CSS 3
UI Components: Custom + Lucide Icons

Backend

Runtime: Node.js 20
API: Next.js API Routes
Database: PostgreSQL 16
ORM: Prisma 5
Cache: Redis 7

Infrastructure

Containerization: Docker + Docker Compose
Reverse Proxy: Caddy 2 (automatic SSL)
Hosting: VPS (Hetzner recommended)

🚀 Quick Start
bash# Clone repository
git clone https://github.com/daasadr/university-lectures.git
cd university-lectures

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database connection

# Generate Prisma Client
npx prisma generate
npx prisma db push

# Run development server
npm run dev
Open http://localhost:3000 🎉
📦 Instalace
Environment Variables
envDATABASE_URL="postgresql://user:password@localhost:5432/university_lectures"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
Database Setup
bashnpx prisma generate
npx prisma db push
npx prisma studio  # Open database GUI
💻 Vývoj
Project Structure
university-lectures/
├── app/                 # Next.js App Router (frontend + API)
├── components/          # React components
├── lib/                 # Backend utilities & scrapers
├── prisma/             # Database schema
├── scripts/            # Deployment scripts
├── public/             # Static files
└── types/              # TypeScript types
Commands
bashnpm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # Run linter

npx prisma studio   # Database GUI
npx prisma generate # Generate Prisma Client
🌐 Deployment
See DEPLOYMENT.md for detailed deployment instructions.
Quick deploy:
bashdocker compose up -d
docker compose exec app npx prisma migrate deploy
🗓️ Roadmap
Phase 1: MVP (Current)

 Database schema
 Frontend UI
 Docker setup
 UK FF scraper
 API endpoints
 Authentication

Phase 2: Features

 Email notifications
 Advanced filters
 Export functionality
 More universities

Phase 3: Expansion

 Mobile app
 AI recommendations
 Community features

🤝 Přispívání
Contributions are welcome! Please read CONTRIBUTING.md for details.
How to Contribute

Fork the repository
Create feature branch (git checkout -b feature/Amazing)
Commit changes (git commit -m 'Add feature')
Push to branch (git push origin feature/Amazing)
Open Pull Request

📜 Licence
Free for non-commercial use ✅
Commercial use requires a license. Contact: licensing@univerzitni-prednasky.cz
See LICENSE for details.
📞 Contact

GitHub Issues: university-lectures/issues
Email: info@univerzitni-prednasky.cz

💰 Support
If you like this project:

⭐ Star on GitHub
💬 Share with friends
🐛 Report bugs
💻 Contribute code


<div align="center">
Made with ❤️ for democratizing education in Czech Republic
Documentation • Deployment Guide
</div>