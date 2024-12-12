import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NonAuthenticatedView } from '@/components/NonAuthenticatedView';
import { AuthenticatedView } from '@/components/AuthenticatedView';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        setIsAuthenticated(!!storedUser);
    }, []);

    return (
        <main className="text-baby-powder font-sans pt-12">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[60vh] flex flex-col items-center justify-center text-center"
                style={{backgroundImage: 'url(/background.jpg)'}}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-night opacity-60"></div>
                {/* Content */}
                <div className="relative z-10 px-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-rusty-red drop-shadow-lg">
                        I'MMIntoYou
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed mb-8">
                        Le site de rencontre exclusif pour les étudiants et passionnés du domaine MMI (Métiers du
                        Multimédia et de l'Internet).
                    </p>
                    {isAuthenticated ? <AuthenticatedView/> : <NonAuthenticatedView/>}
                </div>
            </section>

            {/* Pourquoi MMI Section */}
            <section className="bg-true-blue text-baby-powder py-12">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-4xl font-bold mb-6">Pourquoi MMI ?</h2>
                    <ul className="space-y-4 list-disc list-inside text-lg">
                        <li>Un vivier de talents créatifs</li>
                        <li>Des profils variés : graphisme, développement, communication, UX</li>
                        <li>Un réseau en pleine expansion</li>
                    </ul>
                </div>
            </section>

            {/* Rencontres Ciblées Section */}
            <section className="bg-baby-powder text-night py-12">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-4xl font-bold text-rusty-red mb-6">Rencontres ciblées</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Sur I'MMIntoYou, rencontrez des étudiants et professionnels du domaine MMI partageant vos centres d'intérêt. Échangez, partagez et créez des liens authentiques basés sur votre passion commune pour le multimédia et l'internet.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Que vous soyez à la recherche de collaborations, d'amitiés, ou de l'amour, cette plateforme vous permettra d'élargir votre réseau et de trouver des personnes qui comprennent vos ambitions et vos projets.
                    </p>
                </div>
            </section>

            {/* Événements Exclusifs Section */}
            <section className="bg-lilac text-night py-12">
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-4xl font-bold mb-6">Événements Exclusifs</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Participez à des événements, ateliers et projets collaboratifs réservés à la communauté MMI. Découvrez des opportunités uniques de développer vos compétences, d'apprendre de nouveaux outils, et d'étendre votre champ d'expertise.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Ces rencontres vous permettront non seulement de tisser des liens forts, mais aussi de vous inspirer pour vos futurs projets.
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-rusty-red text-baby-powder py-12">
                <div className="max-w-5xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Rejoignez la Communauté</h2>
                    <p className="text-lg leading-relaxed mb-6">
                        Faites partie d'un réseau dynamique et bienveillant. Une fois connecté, vous aurez accès à toutes les fonctionnalités, les profils et les événements exclusifs.
                    </p>
                    <button className="btn-secondary" onClick={() => router.push('/signup')}>
                        Inscrivez-vous maintenant
                    </button>
                </div>
            </section>
        </main>
    );
}
