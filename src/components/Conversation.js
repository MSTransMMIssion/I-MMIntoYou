import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/solid';


export default function Conversation({ userId, otherUserId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const messagesEndRef = useRef(null);

    // Charger les messages au premier chargement
    useEffect(() => {
        if (!userId || !otherUserId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/messages/${userId}/${otherUserId}`);
                setMessages(response.data.data.map(msg => ({ ...msg, showDate: false })));
                scrollToBottom(); // Scroll en bas après chargement
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        };

        fetchMessages();
    }, [userId, otherUserId]);

    // Fonction pour envoyer un message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await axios.post('/api/messages', {
                fromUserId: userId,
                toUserId: otherUserId,
                content: newMessage,
            });

            setNewMessage('');
            fetchMessages(); // Recharger les messages après envoi
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
        }
    };

    // Fonction pour charger les messages
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/api/messages/${userId}/${otherUserId}`);
            setMessages(response.data.data.map(msg => ({ ...msg, showDate: false })));
            scrollToBottom(); // Scroll en bas après rechargement
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
        }
    };

    // Envoyer avec "Entrée"
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Scroll au dernier message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Formater la date selon les règles
    const formatMessageDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const locale = 'fr-FR';

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (isToday) {
            return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ) {
            return 'Hier';
        }

        const daysDifference = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (daysDifference < 6) {
            const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return dayNames[date.getDay()];
        }

        return date.toLocaleDateString(locale, options);
    };

    // Afficher/Masquer la date du message
    const handleMouseOver = (msgId) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === msgId ? { ...msg, showDate: true } : msg
            )
        );
    };

    const handleMouseOut = (msgId) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === msgId ? { ...msg, showDate: false } : msg
            )
        );
    };

    const handleSelectMessage = (msgId) => {
        setSelectedMessage(msgId === selectedMessage ? null : msgId); // Permet de désélectionner
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            {/* Menu d'options si un message est sélectionné */}
                    {selectedMessage && (
                        <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
                            <p className="text-gray-700">Message sélectionné : ID {selectedMessage}</p>
                            <div className="flex space-x-4">
                                {/* Bouton Modifier */}
                                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                    <PencilIcon className="h-5 w-5 mx-auto" />
                                </button>
                                {/* Bouton Supprimer */}
                                <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                    <TrashIcon className="h-5 w-5 mx-auto" />
                                </button>
                                {/* Bouton Info */}
                                <button className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                                    <InformationCircleIcon className="h-5 w-5 mx-auto" />
                                </button>
                            </div>
                        </div>
                    )}

            <h2 className="text-2xl font-semibold mb-6">Conversation</h2>
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-4 h-96 overflow-y-auto">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        onMouseOver={() => handleMouseOver(msg.id)}
                        onMouseOut={() => handleMouseOut(msg.id)}
                        onClick={() => handleSelectMessage(msg.id)} // Gérer la sélection
                        className={`relative p-3 rounded-lg max-w-xs cursor-pointer ${
                            msg.fromUserId === userId
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-200 text-gray-800 self-start'
                        } ${msg.id === selectedMessage ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <p>{msg.content}</p>
                        <span
                            className={`absolute text-xs text-gray-500 transition-opacity duration-300 ${
                                msg.fromUserId === userId
                                    ? 'left-[-60px] top-1/2 transform -translate-y-1/2'
                                    : 'right-[-60px] top-1/2 transform -translate-y-1/2'
                            } ${msg.showDate ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {formatMessageDate(msg.createdAt)}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex items-center">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tapez un message..."
                    className="flex-grow p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                    rows="2"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 transition"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}
