import { seedData, seedLatest } from '@/api/lib/seedHandler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

import { Skeleton } from './ui/skeleton';

export default function SeedButton() {
    const [isFetchingLastSeed, setIsFetchingLastSeed] = useState(false);
    const [lastSeed, setLastSeed] = useState('');

    const fetchLastSeedDate = async () => {
        setIsFetchingLastSeed(true);
        try {
            const response = await seedLatest();
            const formattedDate = new Date(response.createdAt).toLocaleString();
            setLastSeed(formattedDate);
        } catch (error) {
            console.error('Error fetching last seed date:', error);
        } finally {
            setIsFetchingLastSeed(false);
        }
    };

    const handleSeedDatabase = async () => {
        setIsFetchingLastSeed(true);
        try {
            await seedData();
            console.log("Database seeding successful.");
        } catch (error) {
            console.error('Error seeding database:', error);
            console.log("failed");
        }finally {
            await fetchLastSeedDate();
        }

        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    useEffect(() => {
        fetchLastSeedDate();
    }, []);

    return (
        <div className="flex ml-5 items-center space-x-4 justify-end">
            {isFetchingLastSeed ? (
                <Skeleton className="h-4 w-24" />
            ) : (
                <p className='md:text-sm sm:text-xs'>Last seed: {lastSeed}</p>
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