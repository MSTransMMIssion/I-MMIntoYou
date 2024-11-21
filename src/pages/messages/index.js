import { useEffect, useState } from "react";
import ConversationsList from '@/components/ConversationsList';

export default function MessagesPage() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserId(userData.id);
        }
    }, []);

    if (!userId) return <div>Chargement...</div>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 mt-10">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">
                    📬 Messages
                </h1>
                <ConversationsList userId={userId} />
            </div>
        </div>
    );
}
