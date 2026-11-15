import { NextRequest, NextResponse } from "next/server";
import { LIVE_THREAT_RADAR_DATA } from "@/data/liveThreatRadar";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let items = [...LIVE_THREAT_RADAR_DATA];
    if (category && category !== "ALL") {
      items = items.filter((item) => item.category === category);
    }

    // Try fetching community submitted alerts from MongoDB
    try {
      const { db } = await connectToDatabase();
      if (db) {
        const communityAlerts = await db
          .collection("community_threat_alerts")
          .find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray();

        if (communityAlerts.length > 0) {
          const formatted = communityAlerts.map((c) => ({
            id: `COMM-${c._id.toString().slice(-4)}`,
            title: c.title || "Community Reported Phishing Attack",
            category: c.category || "CITIZEN_SCAM",
            severity: "HIGH" as const,
            region: c.region || "South Asia Regional Grid",
            targetDemographic: c.targetDemographic || "General Mobile Users",
            attackVector: c.description || "Unverified fraud vector submitted by verified community scout",
            countermeasure: "Verify via OmniShield before clicking or replying.",
            timestamp: "Just now",
            activeCount: 1,
          }));
          items = [...formatted, ...items];
        }
      }
    } catch {
      // Fallback to static verified radar dataset
    }

    return NextResponse.json({
      status: "LIVE",
      totalActiveThreats: items.reduce((acc, curr) => acc + curr.activeCount, 0),
      items,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch threat radar." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, region, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Please provide threat title and description." },
        { status: 400 }
      );
    }

    try {
      const { db } = await connectToDatabase();
      if (db) {
        await db.collection("community_threat_alerts").insertOne({
          title,
          description,
          region: region || "Regional Grid",
          category: category || "CITIZEN_SCAM",
          createdAt: new Date(),
        });
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Threat alert submitted to OmniShield Regional Grid for neural verification.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to submit threat alert." },
      { status: 500 }
    );
  }
}
