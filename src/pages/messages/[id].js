import Conversation from '@/components/Conversation';
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import CryptoJS from "crypto-js";

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
        setOtherUserId(parseInt(bytes.toString(CryptoJS.enc.Utf8)));
    }, []);

    useEffect(() => {
         setUserId(JSON.parse(localStorage.getItem('loggedUser')).id);
    }, []);
    return (
        <div>
            <Conversation userId={userId} otherUserId={otherUserId} />
        </div>
    );
}
