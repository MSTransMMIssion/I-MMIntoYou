import '../styles/globals.css';  // Importer les styles globaux (y compris Tailwind)
function MyApp({ Component, pageProps }) {
    return (
        <>
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
