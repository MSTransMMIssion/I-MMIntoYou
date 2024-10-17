import '../styles/main.css'; // Importer les styles globaux (y compris Tailwind)
import Head from 'next/head'; // Importer Head pour ajouter des éléments au head de la page

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>I'MMIntoYou</title>
                <link rel="icon" href="/flavicon.ico" />
            </Head>

            {/* Layout global, par exemple un header commun à toutes les pages */}
            <header className="bg-blue-500 p-4 text-white">
                <h1>I'MMIntoYou</h1>
            </header>

            {/* Le composant de la page courante */}
            <Component {...pageProps} />

            {/* Footer global */}
            <footer className="bg-gray-800 p-4 text-white text-center">
                <p>&copy; 2024 I'MMIntoYou</p>
            </footer>
        </>
    );
}

export default MyApp;
