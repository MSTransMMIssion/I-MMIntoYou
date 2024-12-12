import { useRouter } from 'next/router';

export function AuthenticatedView() {
    const router = useRouter();

    return (
        <div>
            <p className="text-rusty-red text-lg font-semibold mb-4">
                Vous êtes connecté ! Complétez votre profil et commencez à rencontrer des gens.
            </p>
            <button
                className="btn-primary"
                onClick={() => router.push('/profile')}
            >
                Aller à mon profil
            </button>
        </div>
    );
}
