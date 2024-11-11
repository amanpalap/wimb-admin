import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { locationData, number } = body;

        if (!locationData || !number) {
            return NextResponse.json(
                {
                    error: "Location data or bus number missing",
                    success: false
                },
                { status: 400 }
            );
        }

        // Query Firestore for the document with the specific bus number
        const busRef = adminDb.collection("buses").where("busNumber", "==", number);
        const snapshot = await busRef.get();

        if (snapshot.empty) {
            console.log("bus not found")
            return NextResponse.json(
                {
                    error: "Bus not found",
                    success: false
                },
                { status: 404 }
            );
        }

        // Assuming bus numbers are unique, update the first matching document
        const busDoc = snapshot.docs[0];
        await busDoc.ref.update({
            location: {
                lat: locationData.location.lat,
                lng: locationData.location.lng,
            },
        });

        return NextResponse.json(
            {
                message: "Location updated successfully",
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating location:", error);
        return NextResponse.json(
            {
                error: "Failed to update location",
                success: false
            },
            { status: 500 }
        );
    }
}
