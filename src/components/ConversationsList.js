import {useState, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import CryptoJS from 'crypto-js';

export default function ConversationsList({userId}) {
    const [mutualLikes, setMutualLikes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchMutualLikes = async () => {
            try {
                // Fetch likes/mutual likes
                const matchResponse = await axios.get(`/api/likes`);
                const matches = matchResponse.data;

                // Filter mutual likes
                const mutualLikes = matches
                    .filter(like =>
                        like.fromUserId === userId &&
                        like.status === 1 &&
                        matches.some(otherLike =>
                            otherLike.fromUserId === like.toUserId &&
                            otherLike.toUserId === userId &&
                            otherLike.status === 1
                        )
                    )
                    .map(like => like.toUserId);

                // Fetch user details for mutual likes + Last Message
                const mutualLikeUsersWithMessages = await Promise.all(mutualLikes.map(async (id) => {
                    const userResponse = await axios.get(`/api/users/${id}`);
                    const user = userResponse.data.data;

                    // Fetch messages between current user and mutual like user
                    const conversationResponse = await axios.get(`/api/messages/${userId}/${id}`);
                    const messages = conversationResponse.data.data;

                    return {
                        ...user,
                        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
                    };
                }));

                setMutualLikes(mutualLikeUsersWithMessages);
            } catch (error) {
                console.error('Erreur lors de la récupération des mutual likes et messages:', error);
            }
        };

        fetchMutualLikes();
    }, [userId]);

    const secretKey = 'JsuGsqplmeqalbdssdlga12gqo2b';

    const openConversation = (otherUserId) => {
        const encrypted = CryptoJS.AES.encrypt(otherUserId.toString(), secretKey).toString();
        router.push(`/messages/${encodeURIComponent(encrypted)}`);
    };

    return (
        <div className="space-y-4">
            {mutualLikes.length > 0 ? (
                <div>
                    {mutualLikes.map(user => (
                        <div
                            key={user.id}
                            onClick={() => openConversation(user.id)}
                            className="cursor-pointer p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex flex-col space-y-2"
                        >
                            <div className="flex-grow">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {user.name}
                                </h2>
                                {user.lastMessage && user.lastMessage.content ? (
                                    <p className="text-sm text-gray-500">{user.lastMessage.content}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Faites le premier pas
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-8 text-center text-gray-500">Aucun match trouvé</p>
            )}
        </div>
    );
}
