import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

interface CodeVulnerability {
  line: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  title: string;
  description: string;
  matchedSnippet: string;
  suggestedFix: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, filename = "server.py", language = "python" } = body;

    const sourceCode = (code || "").trim();
    if (!sourceCode) {
      return NextResponse.json(
        { error: "Please paste code or configuration file to inspect." },
        { status: 400 }
      );
    }

    const lines = sourceCode.split("\n");
    const vulnerabilities: CodeVulnerability[] = [];

    // Rule patterns for Code Guard
    const rules = [
      {
        regex: /(api[_-]?key|secret|password|auth[_-]?token|passwd)\s*[:=]\s*['"][a-zA-Z0-9_\-\.]{8,}['"]/i,
        severity: "CRITICAL" as const,
        category: "Hardcoded Secret",
        title: "Hardcoded API Key / Secret Detected",
        description: "Hardcoding credentials inside code allows anyone with repo access to hijack cloud infrastructure or customer data.",
        suggestedFix: "Move secret to environment variable: process.env.SECRET_KEY or os.environ.get('SECRET_KEY')",
      },
      {
        regex: /(SELECT\s+.*FROM\s+.*WHERE\s+.*['"]\s*\+|\bexecute\s*\(\s*f['"].*SELECT)/i,
        severity: "CRITICAL" as const,
        category: "SQL Injection",
        title: "Unparameterized SQL Query String Concatenation",
        description: "Attacker can inject arbitrary SQL payloads via untrusted input to dump or delete factory databases.",
        suggestedFix: "Use parameterized queries (e.g., cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,)))",
      },
      {
        regex: /\b(eval|exec|os\.system|child_process\.exec|Runtime\.getRuntime\(\)\.exec)\s*\(/i,
        severity: "CRITICAL" as const,
        category: "Remote Code Execution (RCE)",
        title: "Dangerous Dynamic Code Execution Primitive",
        description: "Executing arbitrary shell commands from unvalidated inputs gives hackers total server or machine control.",
        suggestedFix: "Avoid eval/exec. Use safe strictly typed dispatcher or subprocess with shell=False.",
      },
      {
        regex: /mqtt:\/\/.*:1883|modbus:\/\/.*:502|insecure_skip_verify:\s*true/i,
        severity: "HIGH" as const,
        category: "Unencrypted IoT Factory Protocol",
        title: "Insecure Plaintext Industrial Protocol (MQTT / Modbus)",
        description: "Plaintext industrial machine communication can be intercepted or spoofed by rogue devices on factory Wi-Fi.",
        suggestedFix: "Enforce TLS (MQTTS over port 8883) with mutual client certificate authentication.",
      },
      {
        regex: /allow_origins\s*=\s*\[\s*['"]\*['"]\s*\]|Access-Control-Allow-Origin:\s*\*/i,
        severity: "MEDIUM" as const,
        category: "Permissive CORS",
        title: "Wildcard Access-Control-Allow-Origin (*)",
        description: "Wildcard CORS exposes sensitive internal API endpoints to unauthorized cross-origin web browser requests.",
        suggestedFix: "Whitelist explicit trusted frontend domains only instead of '*'.",
      },
    ];

    lines.forEach((lineText: string, idx: number) => {
      rules.forEach((rule) => {
        if (rule.regex.test(lineText)) {
          vulnerabilities.push({
            line: idx + 1,
            severity: rule.severity,
            category: rule.category,
            title: rule.title,
            description: rule.description,
            matchedSnippet: lineText.trim(),
            suggestedFix: rule.suggestedFix,
          });
        }
      });
    });

    const securityScore = Math.max(
      10,
      100 - vulnerabilities.reduce((acc, v) => acc + (v.severity === "CRITICAL" ? 35 : v.severity === "HIGH" ? 20 : 10), 0)
    );

    const result = {
      type: "code_guard_scan",
      filename,
      language,
      totalLines: lines.length,
      vulnerabilitiesCount: vulnerabilities.length,
      securityScore,
      verdict: vulnerabilities.length === 0 ? "SECURE_CLEAN" : securityScore < 50 ? "CRITICAL_RISK" : "WARNING_ATTENTION_NEEDED",
      vulnerabilities,
      timestamp: new Date().toISOString(),
    };

    // Save to MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("threat_scans").insertOne({
        ...result,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("MongoDB write skipped in dev fallback:", dbErr);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to scan code for vulnerabilities" },
      { status: 500 }
    );
  }
}
