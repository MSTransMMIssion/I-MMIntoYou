import { useEffect, useState } from "react";
import ConversationsList from '@/components/ConversationsList';
import { useRouter } from 'next/router';

export default function MessagesPage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserId(userData.id);
        } else {
            router.push('/login').then(r => r);
        }
    }, [router]);

    if (!userId) return (
        <div className="flex items-center justify-center min-h-screen bg-night">
            <div className="text-xl font-semibold text-baby-powder animate-pulse">Chargement...</div>
        </div>
    );

    return (
        <div className="flex flex-col bg-gradient-to-br from-true-blue to-lilac items-center min-h-screen bg-night text-baby-powder pt-32">
            {/* Conversations List */}
            <div className="w-full max-w-4xl bg-baby-powder rounded-lg shadow-lg p-6">
                <h1 className="text-4xl font-bold text-center text-rusty-red mb-4">📬 Vos Messages</h1>
                <ConversationsList userId={userId} />
            </div>
        </div>
    );
}
