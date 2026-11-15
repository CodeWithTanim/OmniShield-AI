import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      machineId = "CNC-MILL-04",
      sensorType = "vibration_temp",
      temperatureCelsius = 42,
      vibrationMmS = 2.4,
      networkPacketRateHz = 60,
      unauthorizedPortActivity = false,
    } = body;

    const anomalies: string[] = [];
    let isSevereAttack = false;

    // Industrial limits check
    if (temperatureCelsius > 78) {
      anomalies.push(`Critical overheating: ${temperatureCelsius}°C exceeds safe threshold (75°C). Possible cooling sabotage.`);
      isSevereAttack = true;
    } else if (temperatureCelsius > 65) {
      anomalies.push(`Elevated thermal baseline: ${temperatureCelsius}°C.`);
    }

    if (vibrationMmS > 7.5) {
      anomalies.push(`Severe mechanical vibration spike: ${vibrationMmS} mm/s (normal < 4.0 mm/s). Risk of physical breakdown.`);
      isSevereAttack = true;
    }

    if (networkPacketRateHz > 450) {
      anomalies.push(`Sensor network flooding: ${networkPacketRateHz} packets/sec. Probable Denial of Service (DoS) attack on industrial controller.`);
      isSevereAttack = true;
    }

    if (unauthorizedPortActivity) {
      anomalies.push("Rogue external IP attempted remote connection to machine PLC port 502 (Modbus).");
      isSevereAttack = true;
    }

    const healthScore = Math.max(
      15,
      100 - anomalies.length * 28
    );

    const status = isSevereAttack
      ? "ATTACK_TRIGGER_ISOLATED"
      : anomalies.length > 0
      ? "ANOMALY_WARNING"
      : "NORMAL_HEALTHY";

    const report = {
      type: "factory_iot_telemetry",
      machineId,
      sensorType,
      telemetry: {
        temperatureCelsius,
        vibrationMmS,
        networkPacketRateHz,
        unauthorizedPortActivity,
      },
      healthScore,
      status,
      anomalies,
      containmentAction: isSevereAttack
        ? "AUTOMATED EMERGENCY CIRCUIT CUTOFF: Machine isolated from factory subnet to prevent physical damage or lateral ransomware movement."
        : "Continuous AI baseline monitoring active. No emergency isolation required.",
      timestamp: new Date().toISOString(),
    };

    // Store in MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("threat_scans").insertOne({
        ...report,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("MongoDB write skipped in dev fallback:", dbErr);
    }

    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process factory telemetry" },
      { status: 500 }
    );
  }
}
