import Link from 'next/link';
import { Search, Calendar, Bell, Users, BookOpen, Sparkles } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { value: '2,500+', label: 'Přednášek' },
    { value: '4', label: 'Univerzit' },
    { value: '50+', label: 'Oborů' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Pokročilé vyhledávání',
      description: 'Najděte přednášky podle předmětu, oboru, času nebo vyučujícího.',
    },
    {
      icon: Calendar,
      title: 'Osobní rozvrh',
      description: 'Vytvořte si vlastní rozvrh a mějte přehled o všech přednáškách.',
    },
    {
      icon: Bell,
      title: 'Upozornění',
      description: 'Dostávejte notifikace před začátkem přednášek.',
    },
    {
      icon: Users,
      title: 'Komunita',
      description: 'Spojte se s ostatními studenty se stejnými zájmy.',
    },
    {
      icon: BookOpen,
      title: 'Široká nabídka',
      description: 'Přístup k přednáškám z různých univerzit a oborů.',
    },
    {
      icon: Sparkles,
      title: 'Zdarma a otevřené',
      description: 'Vzdělání by mělo být dostupné pro všechny.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Demokratizace přístupu k vysokoškolskému vzdělání
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Objevte veřejně přístupné univerzitní přednášky v České republice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
              >
                Začít vyhledávat
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition text-lg border-2 border-white/20"
              >
                Zjistit více
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proč Univerzitní Přednášky?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platforma, která zpřístupňuje vysokoškolské vzdělání každému
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Připraveni začít?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Zaregistrujte se zdarma a získejte přístup ke stovkám přednášek
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
          >
            Vytvořit účet
          </Link>
        </div>
      </section>
    </div>
  );
}
