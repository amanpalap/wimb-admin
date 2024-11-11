export type Coordinates = {
    latitude: number;
    longitude: number;
};

export async function getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error: GeolocationPositionError) => {
                reject(new Error("Error getting location: " + error.message));
            }
        );
    });
}
