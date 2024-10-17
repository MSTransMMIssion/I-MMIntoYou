import '../styles/main.css'; // Importer les styles globaux (y compris Tailwind)
import Head from 'next/head';
import React from "react";
import Header from "@/components/_header";
import Footer from "@/components/_footer"; // Importer Head pour ajouter des éléments au head de la page

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>I'MMIntoYou</title>
                <link rel="icon" href="/flavicon.ico"/>
            </Head>
            <Header />
            {/* Le composant de la page courante */}
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default MyApp;
