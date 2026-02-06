import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Bell, Users, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen relative">
      {/* Background Image - Nejzadnější vrstva */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/ucebna.jpg"
          alt="Univerzitní učebna"
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay pro lepší čitelnost */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-blue-950/85 backdrop-blur-[2px]" />
      </div>

      {/* Content - Nad pozadím */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 md:py-40 overflow-hidden">
          {/* Dekorativní elementy */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Minimalistický badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 text-sm text-blue-200 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Beta verze • Nyní dostupná
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight animate-fade-in-up">
                Otevřené
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Přednášky
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl font-light leading-relaxed animate-fade-in-up [animation-delay:200ms]">
                Objevte veřejně přístupné univerzitní přednášky napříč celou Českou republikou. 
                Vzdělávání pro každého.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:400ms]">
                <Link
                  href="/search"
                  className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-lg flex items-center justify-center gap-2 shadow-2xl shadow-blue-500/20"
                >
                  Začít vyhledávat
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/5 backdrop-blur-xl text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-lg border border-white/10"
                >
                  Zjistit více
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats - Glassmorphism cards */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Bento grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Proč Otevřené Přednášky?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                Platforma, která zpřístupňuje vysokoškolské vzdělání každému
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-2xl" />
                    
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-300 font-light leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Připraveni začít?
              </h2>
              <p className="text-xl mb-10 text-gray-300 font-light max-w-2xl mx-auto">
                Zaregistrujte se zdarma a získejte přístup ke stovkám přednášek
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-lg shadow-2xl shadow-blue-500/20 group"
              >
                Vytvořit účet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}