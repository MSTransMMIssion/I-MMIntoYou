// pages/403.js
import Link from 'next/link';

export default function Custom403() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <p className="text-gray-700 text-xl mb-6">Accès interdit. Vous n&apos;avez pas les permissions nécessaires pour
                accéder à cette page.</p>
            <Link className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" href={'/'}>
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}
