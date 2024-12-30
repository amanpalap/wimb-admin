"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { getCurrentLocation, Coordinates } from "@/utils/getCurrentLocations";
import toast from "react-hot-toast";

export default function GetLocation() {
    const router = useRouter();
    const { number } = useParams();
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("0 seconds ago");
    const [isSharingPaused, setIsSharingPaused] = useState(false);

    const handleUpdateLocation = useCallback(async () => {
        if (isSharingPaused) return;

        try {
            const coordinates = await getCurrentLocation();
            setLocation(coordinates);
            setError(null);
            const updateDate = new Date();
            setLastUpdated(updateDate);
            setTimeSinceUpdate("0 seconds ago"); // Reset timer on successful update

            const locationData = {
                location: {
                    lat: coordinates.latitude,
                    lng: coordinates.longitude
                }
            };

            // Send PATCH request to update location
            setTimeout(async () => {
                try {
                    await axios.patch('/api/location/renews', {
                        locationData,
                        number
                    });
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        setError("Error updating location: " + error.message);
                        console.error(error);
                    }
                }
            }, 5000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
            setLocation(null);
        }
    }, [isSharingPaused, number]);

    const handlePauseSharing = () => {
        setIsSharingPaused(true);
        toast.success("Stopped sharing for 10 mins");
        setTimeout(() => setIsSharingPaused(false), 600000); // Resume sharing after 10 minutes
    };

    const handleReachedDestination = () => {
        router.push("/start-journey");
    };

    useEffect(() => {
        const interval = setInterval(handleUpdateLocation, 60000);
        handleUpdateLocation();

        return () => clearInterval(interval);
    }, [handleUpdateLocation]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (lastUpdated && !isSharingPaused) {
                const now = new Date();
                const secondsAgo = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
                const displayText =
                    secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo / 60)} minutes ago`;
                setTimeSinceUpdate(displayText);
            }
        }, 10000); // Update every 10 seconds for efficiency

        return () => clearInterval(timer);
    }, [lastUpdated, isSharingPaused]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200">Location Tracker</h2>

                <div>
                    <button
                        onClick={handleUpdateLocation}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold mb-4 transition duration-200 shadow-lg active:translate-y-1 active:shadow-sm"
                        style={{
                            background: "linear-gradient(to bottom, #3b82f6, #1d4ed8)", // Adds a gradient
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Adds a shadow for depth
                        }}
                    >
                        Manually Update Location
                    </button>

                    <div className="w-full flex justify-evenly items-center">
                        <button
                            onClick={handlePauseSharing}
                            className="w-28 text-sm h-28 rounded-full p-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold mb-4 transition duration-200 shadow-lg active:translate-y-1 active:shadow-sm"
                            style={{
                                background: "linear-gradient(to bottom, #fbbf24, #d97706)",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            Stop for <br />10 min
                        </button>

                        <button
                            onClick={handleReachedDestination}
                            className="w-28 h-28 text-sm rounded-full p-4 bg-green-600 hover:bg-green-700 text-white font-semibold mb-4 transition duration-200 shadow-lg active:translate-y-1 active:shadow-sm"
                            style={{
                                background: "linear-gradient(to bottom, #10b981, #065f46)",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            Reached Destination
                        </button>
                    </div>
                </div>

                {location && (
                    <div className="bg-green-700 p-4 rounded-lg mt-4 text-center text-gray-100">
                        <p className="text-lg">Location Updated Successfully</p>
                        <p className="text-sm">
                            Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
                        </p>
                        <p className="text-lg font-bold text-gray-100 mt-2">
                            Last updated: {lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isSharingPaused ?
                            <div className="text-sm mt-1 flex items-center justify-center">
                                <p className="bg-red-600 rounded-lg px-3 py-1">Stopped for 10 mins</p>
                            </div>
                            : <p className="text-sm text-gray-300 mt-1">
                                {timeSinceUpdate}
                            </p>
                        }
                    </div>
                )}

                {error && (
                    <div className="bg-red-700 p-4 rounded-lg mt-4 text-center text-gray-100">
                        <p className="text-lg">Error Fetching Location</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!location && !error && (
                    <div className="bg-gray-700 p-4 rounded-lg mt-4 text-center text-gray-300">
                        <p className="text-lg">No Location Data</p>
                        <p className="text-sm">Press &quotUpdate Location&quot to share your location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
