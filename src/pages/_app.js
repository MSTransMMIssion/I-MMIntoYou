import '../styles/main.css'; // Importer les styles globaux (y compris Tailwind)
import Head from 'next/head';
import React from "react";
import Header from "@/components/_header";
import Footer from "@/components/_footer"; // Importer Head pour ajouter des éléments au head de la page

function MyApp({Component, pageProps}) {
    return (
        <>
            <Head>
                <title>I'MMIntoYou</title>
                <link rel="icon" href="/flavicon.ico"/>
                <link rel="stylesheet" type="text/css" charSet="UTF-8"
                      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
                <link rel="stylesheet" type="text/css"
                      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
            </Head>
            <div className="bg-gradient-to-br from-true-blue to-lilac min-h-[100vh]">
                <Header/>
                {/* Le composant de la page courante */}
                <Component {...pageProps} />
                <Footer/>
            </div>
        </>
    );
}

export default MyApp;
