"use client";

import axios, { AxiosError } from "axios";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import firebaseApp from "@/lib/firebaseClient";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'

export default function EmailLoginForm() {
    const router = useRouter()
    const auth = getAuth(firebaseApp);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true); // Set loading to true at the start

        async function loginUser(email: string, password: string) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const token = await user.getIdToken();
                const response = await axios.post("/api/auth/login", { token });

                if (response.status === 200 && response.data.success) {
                    toast.success("Login successful!");
                    router.push("/start-journey");
                } else if (response.status === 403) {
                    toast.error(`Login failed: ${response.data.error}`);
                } else {
                    toast.error("Login failed: Unexpected response");
                }
            } catch (error) {
                if (error instanceof FirebaseError) {
                    toast.error(`Firebase error: ${error.message}`);
                } else if (error instanceof AxiosError && error.response) {
                    toast.error(`Login failed: ${error.response.data.error}`);
                } else {
                    toast.error(`Error logging in user: ${error instanceof Error ? error.message : "Unknown error"}`);
                }
            } finally {
                setLoading(false); // Set loading to false after login attempt
            }
        }

        loginUser(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">Email Login</h2>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        <span className="text-gray-400">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="text-gray-400">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </label>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors duration-200"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
