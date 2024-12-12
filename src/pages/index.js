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
        <main
            className="min-h-screen bg-night text-baby-powder relative pt-6 font-sans bg-cover"
            style={{ backgroundImage: 'url(/background.jpg)' }}
        >
            <div className="absolute inset-0 bg-night opacity-60"></div>

            <div className="relative z-10 max-w-5xl mx-auto pt-20 pb-10">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-rusty-red drop-shadow-lg">
                        I'MMIntoYou
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Le site de rencontre exclusif pour les étudiants et passionnés du domaine MMI (Métiers du Multimédia et de l'Internet).
                    </p>
                </header>

                <section className="bg-baby-powder text-night shadow-xl rounded-xl p-8 mb-16 mx-4 md:mx-0">
                    {isAuthenticated ? <AuthenticatedView /> : <NonAuthenticatedView />}
                </section>

                <section className="flex flex-col md:flex-row gap-8 mb-16">
                    <article className="flex-1 bg-baby-powder rounded-lg p-6 shadow-lg">
                        <h2 className="text-3xl font-bold text-rusty-red mb-4">Rencontres ciblées</h2>
                        <p className="text-night leading-relaxed mb-4">
                            Sur I'MMIntoYou, rencontrez des étudiants et professionnels du domaine MMI partageant vos centres d'intérêt.
                            Échangez, partagez et créez des liens authentiques basés sur votre passion commune pour le multimédia et l'internet.
                        </p>
                        <p className="text-night">
                            Que vous soyez à la recherche de collaborations, d'amitiés, ou de l'amour, cette plateforme vous permettra
                            d'élargir votre réseau et de trouver des personnes qui comprennent vos ambitions et vos projets.
                        </p>
                    </article>

                    <aside className="md:w-1/3 bg-true-blue bg-opacity-80 rounded-lg p-6 text-baby-powder shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Pourquoi MMI ?</h3>
                        <ul className="space-y-2 list-disc list-inside">
                            <li>Un vivier de talents créatifs</li>
                            <li>Des profils variés : graphisme, développement, communication, UX</li>
                            <li>Un réseau en pleine expansion</li>
                        </ul>
                    </aside>
                </section>

                <section className="flex flex-col md:flex-row gap-8 mb-16">
                    <article className="flex-1 bg-baby-powder rounded-lg p-6 shadow-lg">
                        <h2 className="text-3xl font-bold text-rusty-red mb-4">Événements Exclusifs</h2>
                        <p className="text-night leading-relaxed mb-4">
                            Participez à des événements, ateliers et projets collaboratifs réservés à la communauté MMI.
                            Découvrez des opportunités uniques de développer vos compétences,
                            d'apprendre de nouveaux outils, et d'étendre votre champ d'expertise.
                        </p>
                        <p className="text-night">
                            Ces rencontres vous permettront non seulement de tisser des liens forts,
                            mais aussi de vous inspirer pour vos futurs projets.
                        </p>
                    </article>

                    <aside className="md:w-1/3 bg-lilac rounded-lg p-6 text-night shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Sécurité & Confidentialité</h3>
                        <p className="leading-relaxed">
                            Nous prenons au sérieux la protection de vos données.
                            L'ensemble de vos informations personnelles reste confidentiel.
                            Nous mettons en place des mesures de sécurité avancées pour garantir votre tranquillité d'esprit.
                        </p>
                    </aside>
                </section>

                <section className="bg-baby-powder rounded-lg p-6 shadow-lg mb-16">
                    <h2 className="text-3xl font-bold text-rusty-red mb-4 text-center">Rejoignez la Communauté</h2>
                    <p className="text-night text-center max-w-2xl mx-auto mb-6">
                        Faites partie d'un réseau dynamique et bienveillant.
                        Une fois connecté, vous aurez accès à toutes les fonctionnalités,
                        les profils et les événements exclusifs.
                    </p>
                </section>

                <footer className="text-center text-baby-powder text-sm">
                    © {new Date().getFullYear()} I'MMIntoYou. Tous droits réservés.
                </footer>
            </div>
        </main>
    );
}
