import Link from 'next/link';
import { BookOpen, Github, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="font-bold">Univerzitní Přednášky</span>
            </div>
            <p className="text-sm text-gray-600">
              
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-gray-600 hover:text-blue-600">
                  Vyhledávání
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-600 hover:text-blue-600">
                  Můj rozvrh
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-gray-600 hover:text-blue-600">
                  Univerzity
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  O projektu
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Právní informace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                  Ochrana osobních údajů
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  Podmínky použití
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-gray-600 hover:text-blue-600">
                  Licence
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/daasadr/university-lectures" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@univerzitni-prednasky.cz"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p className="flex items-center justify-center space-x-1">
            <span>Vytvořeno s</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>pro podporu celoživotního vzdělání v České republice</span>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} 
          </p>
        </div>
      </div>
    </footer>
  );
}
