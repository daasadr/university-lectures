import { redirect } from 'next/navigation';
import { auth } from '../../../auth';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const { user } = session;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Můj profil
          </h1>
          <p className="text-gray-600 mb-8">
            Přehled vašich základních údajů a budoucí nastavení účtu.
          </p>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-500">
                Jméno
              </div>
              <div className="text-lg text-gray-900">
                {user.name || 'Neuvedeno'}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-500">
                Email
              </div>
              <div className="text-lg text-gray-900">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

