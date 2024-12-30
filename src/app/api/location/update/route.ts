export const revalidate = 0;

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
    try {
        // Parse the JSON body from the request
        const { from, to, busNumber, via, location } = await request.json();

        // Validate required fields
        if (!from || !to || !via || !busNumber) {
            return NextResponse.json(
                {
                    error: "All fields are required",
                    success: false
                },
                { status: 400 }
            );
        }

        // Add the document to the "buses" collection
        const newBus = await adminDb.collection("buses").add({
            from,
            to,
            busNumber,
            via,
            location,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                message: "Bus information submitted successfully",
                success: true,
                id: newBus.id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving bus data:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                success: false
            },
            { status: 500 }
        );
    }
}
