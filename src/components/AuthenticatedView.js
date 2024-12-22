import { useRouter } from 'next/router';

export function AuthenticatedView() {
    const router = useRouter();

    return (
        <div className="text-center bg-baby-powder text-night py-8 px-6 rounded-lg shadow-md max-w-xl mx-auto">
            <p className="text-rusty-red text-xl font-bold mb-4">
                Vous êtes connecté !
            </p>
            <p className="text-lg mb-6">
                Complétez votre profil et commencez à rencontrer des gens passionnés.
            </p>
            <button
                className="btn btn-primary"
                onClick={() => router.push('/profile')}
            >
                Voir mon profil
            </button>
        </div>
    );
}
