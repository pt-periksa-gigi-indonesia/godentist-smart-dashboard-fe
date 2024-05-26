import { seedData } from '@/api/lib/seedHandler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

export default function SeedButton() {
    const [seedMessage, setSeedMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSeedDatabase = async () => {
        setIsLoading(true);
        setSeedMessage(null);
        try {
            const response = await seedData();
            setSeedMessage(response.message);
            console.log(response);
        } catch (error) {
            console.error('Error seeding database:', error);
            setSeedMessage('Error occurred while seeding the database.');
            console.log("failed");
        }

        setTimeout(() => {
            setIsLoading(false);
            setSeedMessage("Database seeded successfully!");
            window.location.reload();
        }, 2000);
    };

    return (
        <div div className="flex ml-5 items-center space-x-4 justify-end">
            {isLoading ? (
                <p className="text-sm">Loading...</p>
            ) : (
                seedMessage && <p className="text-sm">{seedMessage}</p>
            )}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full flex items-center"
                onClick={handleSeedDatabase}
            >
                <FontAwesomeIcon icon={faSyncAlt} />
            </button>

        </div>
    )
}