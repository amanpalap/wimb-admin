export const revalidate = 0;

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
    try {
        // Attempt to parse JSON body
        let body;
        try {
            body = await request.json();
        } catch {
            // If JSON parsing fails, assume raw text and convert to JSON
            const text = await request.text();
            body = { busNumber: text.trim() }; // Wrap raw text in a JSON object
        }

        const { busNumber } = body;
        console.log(busNumber)

        // Validate the required field
        if (!busNumber) {
            return NextResponse.json(
                {
                    error: "Bus number is required",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Normalize the bus number
        const normalizedBusNumber = busNumber.replace(/[a-z]/g, (char: string) =>
            char.toUpperCase()
        );

        // Query the collection to find the document with the matching bus number
        const snapshot = await adminDb
            .collection("buses")
            .where("busNumber", "==", normalizedBusNumber)
            .get();

        if (snapshot.empty) {
            return NextResponse.json(
                {
                    error: "Bus not found",
                    success: false,
                },
                { status: 404 }
            );
        }

        // Delete the document(s) matching the bus number
        const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
        await Promise.all(deletePromises);

        return NextResponse.json(
            {
                message: "Bus information deleted successfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting bus data:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                success: false,
            },
            { status: 500 }
        );
    }
}
