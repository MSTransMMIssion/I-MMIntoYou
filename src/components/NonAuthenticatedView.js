import { useRouter } from 'next/router';

export function NonAuthenticatedView() {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div>
            <p className="text-lilac text-lg mb-4">
                Connectez-vous pour découvrir des profils intéressants et faire de nouvelles rencontres.
            </p>
            <button
                onClick={() => router.push('/login')}
                className="btn-primary"
            >
                Se connecter
            </button>
            <div className="mt-8">
                <p className="text-night text-md">Pas encore inscrit ?</p>
                <button
                    onClick={() => router.push('/signup')}
                    className="btn-link"
                >
                    Créez un compte ici.
                </button>
            </div>
        </div>
    );
}
