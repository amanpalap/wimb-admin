'use client';
import { useState } from 'react';
import MapComponent from '@/components/Map'; // Import your MapComponent

// Define the type for the user object
interface User {
    id: number;
    name: string;
    lat: number;
    long: number;
}

const MapPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [databaseContent, setDatabaseContent] = useState<any>(null); // To store full database content



    return (
        <div>
            <h1>User Locations</h1>

            {/* Print the entire database content */}
            <pre>{JSON.stringify(databaseContent, null, 2)}</pre>

            {/* Pass the fetched users to MapComponent */}
            <MapComponent users={users} />
        </div>
    );
};

export default MapPage;
