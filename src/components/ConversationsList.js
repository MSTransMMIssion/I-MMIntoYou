import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ConversationsList({ userId }) {
    const [conversations, setConversations] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`/api/conversations/${userId}`);
                setConversations(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des conversations:', error);
            }
        };

        fetchConversations();
    }, [userId]);

    const openConversation = (otherUserId) => {
        router.push(`/messages/${otherUserId}`);
    };

    return (
        <div className="space-y-4">
            {conversations.length > 0 ? (
                conversations.map((conv) => (
                    <div
                        key={`${conv.fromUserId}-${conv.toUserId}`}
                        onClick={() => openConversation(conv.otherUserId)}
                        className="cursor-pointer p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center"
                    >
                        <div className="flex-grow">
                            <h2 className="text-lg font-semibold text-gray-800">{conv.otherUserName}</h2>
                            <p className="text-sm text-gray-500">Dernier message</p>
                        </div>
                        <span className="text-sm text-gray-400">📬</span>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Aucune conversation trouvée</p>
            )}
        </div>
    );
}
