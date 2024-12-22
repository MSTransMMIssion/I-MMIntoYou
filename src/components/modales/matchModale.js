import React from 'react';
import { useRouter } from 'next/router';
import CryptoJS from "crypto-js";

export default function MatchModale({ target , onClose  }) {
    const router = useRouter();

    const secretKey = 'JsuGsqplmeqalbdssdlga12gqo2b';

    const openConversation = () => {
        console.log(target.id)
        const encrypted = CryptoJS.AES.encrypt(target.id.toString(), secretKey).toString();
        console.log("url qui est crypté : ",encodeURIComponent(encrypted)); // Encoder pour l'URL
        router.push(`/messages/${encodeURIComponent(encrypted)}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">C&apos;EST UN MATCH</h1>
                <p className="text-gray-700 mb-4">Vous avez matché avec :</p>
                {target && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">{target.name}</h2>
                        <p className="text-gray-600">Localisation : {target.location}</p>
                    </div>
                )}
                <p className="text-gray-700 mb-6">
                    Vous pouvez envoyer un message ou continuer de chercher l&apos;amour.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                    >
                        Continuer de chercher
                    </button>
                    <button
                        onClick={openConversation}
                        className="bg-pink-400 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-500 transition duration-200"
                    >
                        Envoyer un message
                    </button>
                </div>
            </div>
        </div>
    );
}
