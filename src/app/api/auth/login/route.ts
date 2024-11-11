import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    try {
        // Verify the token using Firebase Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Create a new response with a cookie set
        const response = NextResponse.json(
            {
                message: "Login successful",
                uid: decodedToken.uid,
                email: decodedToken.email,
                success: true,
            },
            { status: 200 }
        );

        // Set a cookie for the session
        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        console.error("Error verifying token:", error);

        return NextResponse.json(
            {
                error: "Invalid or expired token",
                success: false,
            },
            { status: 401 }
        );
    }
}