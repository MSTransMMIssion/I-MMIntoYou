import React from "react";
import {useRouter} from "next/router";


export default function Header() {
const router = useRouter();
    return (
        <>
            <header className="bg-white shadow-md p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo / Nom du site */}
                    <div className="flex items-center">
                        <img src="/logo.png" alt="I'MMIntoYou Logo"
                             className="h-16 w-16 mr-3"/>
                        <h1 className="text-3xl font-bold text-blue-600">I'MMIntoYou</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                            Home
                        </a>
                        <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                            About
                        </a>
                        <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                            Contact
                        </a>
                    </nav>

                    <div className="hidden md:flex space-x-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md"
                            onClick={() => router.push('/login')}
                        >
                            Se connecter
                        </button>
                        <button
                            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300 shadow-md"
                            onClick={() => router.push('/signup')}
                        >
                            S'inscrire
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button className="text-gray-600 focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

        </>
    );
}