import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            {
                message: "Logged out",
                success: true
            }
        );
        response.cookies.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 0,
            sameSite: "strict",
        });
        return response;
    } catch (error) {
        console.error("Error clearing session cookie:", error);
        return NextResponse.json(
            {
                message: "Failed to log out",
                success: false
            }, { status: 500 }
        );
    }
}