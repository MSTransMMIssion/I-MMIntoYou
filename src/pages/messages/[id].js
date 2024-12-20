import Conversation from '@/components/Conversation';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

export default function Id() {
    const [userId, setUserId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const currentUrl = window.location.pathname;
        const parts = currentUrl.split('/messages/');
        const chaineDeCaracteres = parts[1];

        console.log(chaineDeCaracteres);

        const secretKey = 'JsuGsqplmeqalbdssdlga12gqo2b';

        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(chaineDeCaracteres), secretKey);
        console.log(bytes.toString(CryptoJS.enc.Utf8));
        let otherUser = parseInt(bytes.toString(CryptoJS.enc.Utf8));
        if (verifyOtherUserExist(otherUser)) setOtherUserId(otherUser);
    }, []);

    const verifyOtherUserExist = async (otherUser) => {
        try {
            const response = await axios.get("/api/users"); // Assurez-vous que cette route retourne les utilisateurs
            const users = response.data.data;
            console.log(users);
            const userExists = users.find(user => user.id === otherUser);

            if (userExists) {
                setRealUser(userExists);
                console.log("real : ", userExists);
                return true;
            } else {
                console.log("L'utilisateur n'est pas réel");
                return false;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        }
    };

    useEffect(() => {
        setUserId(JSON.parse(localStorage.getItem('loggedUser')).id);
    }, []);

    const handleBackClick = () => {
        router.push("/messages");
    };

    return (
        <div className="bg-gradient-to-br from-true-blue to-lilac py-16 min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full mx-auto text-baby-powder rounded-lg px-6">
                <div onClick={handleBackClick} className="cursor-pointer bg-night rounded-3xl p-2 fixed top-20 left-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
                    </svg>
                </div>
                <Conversation userId={userId} otherUser={realUser} otherUserId={otherUserId}/>
            </div>
        </div>
    );
}
