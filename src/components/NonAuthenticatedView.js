import { useRouter } from 'next/router';

export function NonAuthenticatedView() {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div>
            <p className="text-gray-500 text-lg mb-4">
                Connectez-vous pour découvrir des profils intéressants et faire de nouvelles rencontres.
            </p>
            <button
                onClick={handleLoginRedirect}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-transform transform hover:scale-105"
            >
                Se connecter
            </button>
            <div className="mt-8">
                <p className="text-gray-600 text-md">Pas encore inscrit ?</p>
                <button
                    onClick={() => router.push('/signup')}
                    className="text-blue-600 font-semibold hover:underline mt-2"
                >
                    Créez un compte ici.
                </button>
            </div>
        </div>
    );
}
