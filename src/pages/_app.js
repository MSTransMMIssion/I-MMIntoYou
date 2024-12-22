import '../styles/main.css'; // Importer les styles globaux
import Head from 'next/head';
import React from "react";
import Header from "@/components/_header";
import Footer from "@/components/_footer";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>I&apos;MMIntoYou</title>
            </Head>
            <div className="bg-gradient-to-br from-true-blue to-lilac">
                <Header />
                {/* Le composant de la page courante */}
                <Component {...pageProps} />
                <Footer />
            </div>
        </>
    );
}

export default MyApp;
