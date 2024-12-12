import Conversation from '@/components/Conversation';
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";

export default function Id() {
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
         setUserId(JSON.parse(localStorage.getItem('loggedUser')).id);
    }, []);
    return (
        <div>
            <Conversation userId={userId} otherUserId={parseInt(router.query.id)} />
        </div>
    );
}
