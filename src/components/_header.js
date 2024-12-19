import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser");
        if (storedUser) {
            setIsAuthenticated(true);
            const userData = JSON.parse(storedUser);
            fetchPrimaryProfilePicture(userData.id).then(r => r);
        }

        const handleAuthChange = () => {
            const updatedUser = localStorage.getItem("loggedUser");
            setIsAuthenticated(!!updatedUser);

            if (updatedUser) {
                const userData = JSON.parse(updatedUser);
                fetchPrimaryProfilePicture(userData.id).then(r => r);
            } else {
                setProfilePicture(null);
            }
        };

        window.addEventListener("authChanged", handleAuthChange);
        return () => {
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    const fetchPrimaryProfilePicture = async (userId) => {
        try {
            const response = await fetch(`/api/users/${userId}/profilePictures`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const primaryPicture = data.data.find((picture) => picture.isPrimary) || data.data[0];
                setProfilePicture(primaryPicture.url);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la photo de profil :", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedUser");
        setIsAuthenticated(false);
        router.push("/login");

        const authChangedEvent = new Event("authChanged");
        window.dispatchEvent(authChangedEvent);
    };

    const currentPage = router.pathname;

    return (
        <header className="bg-night bg-opacity-90 text-baby-powder shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-end md:justify-between items-center md:hidden p-4">
                {/* Menu hamburger pour mobile */}
                <button
                    className="text-baby-powder focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
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

            <div className="hidden md:flex container mx-auto justify-between items-center p-4">
                {/* Logo / Nom du site */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="I'MMIntoYou Logo" className="h-12 w-12 mr-3" />
                    <h1 className="text-2xl font-bold text-rusty-red">I'MMIntoYou</h1>
                </div>

                {/* Navigation */}
                <nav className="flex space-x-6">
                    <a
                        href="/"
                        className={`text-baby-powder hover:text-true-blue transition-colors duration-300 ${
                            currentPage === "/" ? "text-rusty-red font-bold" : ""
                        }`}
                    >
                        Home
                    </a>
                    <a
                        href="/match"
                        className={`text-baby-powder hover:text-true-blue transition-colors duration-300 ${
                            currentPage === "/match" ? "text-rusty-red font-bold" : ""
                        }`}
                    >
                        Match
                    </a>
                    {isAuthenticated && (
                        <a
                            href="/messages"
                            className={`text-baby-powder hover:text-true-blue transition-colors duration-300 ${
                                currentPage === "/messages" ? "text-rusty-red font-bold" : ""
                            }`}
                        >
                            Messages
                        </a>
                    )}
                </nav>

                {/* Photo de profil ou boutons d'authentification */}
                <div className="relative">
                    {isAuthenticated && profilePicture ? (
                        <div
                            className="relative cursor-pointer"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <img
                                src={profilePicture}
                                alt="Photo de profil"
                                className="h-12 w-12 rounded-full border-2 border-rusty-red"
                            />
                            {isDropdownOpen && (
                                <div
                                    className="absolute right-0 w-64 bg-white py-2 shadow-lg rounded-lg"
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    <button
                                        onClick={() => router.push("/profile")}
                                        className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                                            currentPage === "/profile" ? "bg-gray-100 font-bold" : ""
                                        }`}
                                    >
                                        Consulter le profil
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex space-x-4">
                            <button className="btn btn-primary" onClick={() => router.push("/login")}>
                                Se connecter
                            </button>
                            <button className="btn btn-secondary" onClick={() => router.push("/signup")}>
                                S'inscrire
                            </button>
                        </div>
                    )}
                </div>

                {/* Menu hamburger pour mobile */}
                <div className="md:hidden">
                    <button className="text-baby-powder focus:outline-none">
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

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300`}
            >
                {isMobileMenuOpen && (
                    <>
                        <button
                            className="absolute top-4 right-4 text-gray-700 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <nav className="flex flex-col items-start p-6 space-y-4">
                            <a
                                href="/"
                                className={`text-gray-700 hover:text-true-blue transition-colors duration-300 ${
                                    currentPage === "/" ? "font-bold" : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </a>
                            <a
                                href="/match"
                                className={`text-gray-700 hover:text-true-blue transition-colors duration-300 ${
                                    currentPage === "/match" ? "font-bold" : ""
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Match
                            </a>
                            {isAuthenticated && (
                                <>
                                    <a
                                        href="/messages"
                                        className={`text-gray-700 hover:text-true-blue transition-colors duration-300 ${
                                            currentPage === "/messages" ? "font-bold" : ""
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Messages
                                    </a>
                                    <a
                                        href="/profile"
                                        className={`text-gray-700 hover:text-true-blue transition-colors duration-300 ${
                                            currentPage === "/profile" ? "font-bold" : ""
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profil
                                    </a>
                                    <button
                                        className="text-gray-700 hover:text-red-600 transition-colors duration-300"
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            )}
                            {!isAuthenticated && (
                                <>
                                    <button
                                        className="text-gray-700 hover:text-true-blue transition-colors duration-300"
                                        onClick={() => {
                                            router.push("/login");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Se connecter
                                    </button>
                                    <button
                                        className="text-gray-700 hover:text-true-blue transition-colors duration-300"
                                        onClick={() => {
                                            router.push("/signup");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        S'inscrire
                                    </button>
                                </>
                            )}
                        </nav>
                    </>
                )}
            </div>
        </header>
    );
}
