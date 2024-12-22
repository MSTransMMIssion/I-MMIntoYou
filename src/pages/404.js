import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-gray-700 text-xl mb-6">Oups ! La page que vous cherchez n&apos;existe pas.</p>
            <Link
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}
