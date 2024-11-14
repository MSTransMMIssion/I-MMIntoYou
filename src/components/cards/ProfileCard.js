// ProfileCard.js
import {useState} from 'react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BoltIcon,
    HeartIcon,
    PencilIcon,
    StarIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';

export default function ProfileCard({
                                        user,
                                        profilePictures,
                                        isEditable = false,
                                        onEdit = () => {
                                        },
                                        showActions = false
                                    }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullBio, setShowFullBio] = useState(false);

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === profilePictures.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? profilePictures.length - 1 : prevIndex - 1
        );
    };

    const toggleBio = () => {
        setShowFullBio((prev) => !prev);
    };

    const calculateAge = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="relative">
                {/* Carousel for profile pictures */}
                <div className="flex items-center justify-center overflow-hidden relative">
                    {profilePictures.length > 0 ? (
                        <img
                            src={profilePictures[currentIndex].url}
                            alt={`Profile ${currentIndex}`}
                            className="w-full h-96 object-cover rounded-t-3xl"
                        />
                    ) : (
                        <div
                            className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-3xl">
                            Aucune photo de profil disponible
                        </div>
                    )}
                    {/* Carousel Controls */}
                    <button
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-black"/>
                    </button>
                    <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                    >
                        <ArrowRightIcon className="h-6 w-6 text-black"/>
                    </button>
                </div>

                {/* Match Label */}
                {isEditable && (
                    <div
                        className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        ❤️ Best Match
                    </div>
                )}
            </div>

            {/* Profile Details */}
            <div className="p-8 text-center">
                <div className="flex justify-center items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user.name} {user.surname}
                    </h1>
                    {isEditable && (
                        <PencilIcon
                            className="h-6 w-6 ml-3 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={onEdit}
                        />
                    )}
                </div>
                <p className="text-lg text-left text-gray-500 mb-4 whitespace-pre-line leading-relaxed">
                    {user.bio
                        ? showFullBio
                            ? user.bio
                            : `${user.bio.slice(0, 100)}...`
                        : "Aucune biographie disponible"}
                    {user.bio && user.bio.length > 100 && (
                        <button
                            onClick={toggleBio}
                            className="text-blue-500 ml-2 hover:underline"
                        >
                            {showFullBio ? "Voir moins" : "Voir plus"}
                        </button>
                    )}
                </p>
                <div className="text-left text-gray-700 space-y-2">
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Âge</strong> {calculateAge(user.date_of_birth)}</p>
                    <p><strong>Genre :</strong> {user.gender}</p>
                    <p><strong>Orientation :</strong> {user.sexual_orientation}</p>
                    <p><strong>Localisation :</strong> {user.location}</p>
                </div>

                {showActions && (
                    <div className="flex justify-around px-6 py-4 mt-6">
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100">
                            <StarIcon className="h-6 w-6 text-yellow-400"/>
                        </button>
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100">
                            <HeartIcon className="h-6 w-6 text-red-500"/>
                        </button>
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100">
                            <XMarkIcon className="h-6 w-6 text-gray-400"/>
                        </button>
                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100">
                            <BoltIcon className="h-6 w-6 text-purple-500"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
