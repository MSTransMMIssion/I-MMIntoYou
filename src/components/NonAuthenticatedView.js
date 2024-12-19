import { useRouter } from 'next/router';

export function NonAuthenticatedView() {
    const router = useRouter();

    return (
        <div className="text-center bg-baby-powder text-night py-8 px-6 rounded-lg shadow-md max-w-xl mx-auto">
            <p className="text-lilac text-xl font-bold mb-4">
                Rejoignez-nous dès aujourd'hui !
            </p>
            <p className="text-lg mb-6">
                Connectez-vous pour découvrir des profils inspirants et créer des liens authentiques.
            </p>
            <button
                onClick={() => router.push('/login')}
                className="btn btn-primary"
            >
                Se connecter
            </button>
            <div className="mt-6">
                <p className="text-night text-md">Pas encore inscrit ?</p>
                <button
                    onClick={() => router.push('/signup')}
                    className="btn btn-link"
                >
                    Créez un compte ici.
                </button>
            </div>
        </div>
    );
}
