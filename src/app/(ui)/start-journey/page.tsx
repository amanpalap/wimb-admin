"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormData {
    from: string;
    to: string;
    busNumber: string;
    location: {
        lat: number;
        lng: number;
    };
}

export default function BusForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        from: "",
        to: "",
        busNumber: "",
        location: {
            lat: 0,
            lng: 0,
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Apply validation based on field name
        if (name === "from" || name === "to") {
            // Only allow alphabetic characters and spaces
            if (/^[a-zA-Z]*$/.test(value)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else if (name === "busNumber") {
            // Only allow alphanumeric characters, no spaces
            if (/^[a-zA-Z0-9]*$/.test(value)) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const capitalizedData = {
            ...formData,
            busNumber: formData.busNumber.toUpperCase(),
        };

        try {
            const response = await axios.post("/api/location/update", capitalizedData);
            if (response.status === 201) {
                toast.success("Data submitted successfully");
                setFormData({ from: "", to: "", busNumber: "", location: { lat: 0, lng: 0 } });
                router.push(`/start-journey/${formData.busNumber}`);
            }
        } catch (error: unknown) {
            toast.error("Failed to submit data");
            console.error(error)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">Bus Information</h2>

                <label className="block mb-4">
                    <span className="text-gray-400">From</span>
                    <input
                        type="text"
                        name="from"
                        placeholder="Enter departure location"
                        value={formData.from}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-400">To</span>
                    <input
                        type="text"
                        name="to"
                        placeholder="Enter destination"
                        value={formData.to}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-400">Bus Number</span>
                    <input
                        type="text"
                        name="busNumber"
                        placeholder="Enter bus number"
                        value={formData.busNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors duration-200"
                >
                    Start Location Sharing
                </button>
            </form>
        </div>
    );
}
