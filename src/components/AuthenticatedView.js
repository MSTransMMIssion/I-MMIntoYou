import { useRouter } from 'next/router';
export function AuthenticatedView() {
    const router = useRouter();

    return (
        <div>
            <p className="text-green-600 text-lg font-semibold mb-4">
                Vous êtes connecté ! Complétez votre profil et commencez à rencontrer des gens.
            </p>
            <button
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                onClick={() => router.push('/profile')}
            >
                Aller à mon profil
            </button>
        </div>
    );
}
