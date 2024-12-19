import Conversation from '@/components/Conversation';
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

//decode

export default function Id() {
    const [userId, setUserId] = useState(null);
    const [otherUserId, setOtherUserId] = useState(null);
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
        verifyOtherUserExist(otherUser)
    }, []);

    const verifyOtherUserExist = async (otherUser) => {
        try {
            const response = await axios.get("/api/users"); // Assurez-vous que cette route retourne les utilisateurs
            const users = response.data.data;
            console.log(users);
            const userExists = users.find(user => user.id === otherUser);

            if (userExists) {
                console.log("L'utilisateur est réel");
            } else {
                console.log("L'utilisateur n'est pas réel")
                router.push('/messages')
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
        }
    }

    useEffect(() => {
         setUserId(JSON.parse(localStorage.getItem('loggedUser')).id);
    }, []);
    return (
        <div>
            <Conversation userId={userId} otherUserId={otherUserId} />
        </div>
    );
}
