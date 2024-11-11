import { database } from '../firebase/firebase';
import { ref, set } from 'firebase/database';

interface Location {
    lat: number | null;
    long: number | null;
}

const shareLocation = (location: Location) => {
    const userRef = ref(database, 'users/user-id');
    set(userRef, {
        lat: location.lat,
        long: location.long,
        timestamp: Date.now(),
    });
};

const updateLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const location = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
            };
            shareLocation(location);
        });
    }
};

// Call updateLocation periodically to share location in real time
setInterval(updateLocation, 10000);
