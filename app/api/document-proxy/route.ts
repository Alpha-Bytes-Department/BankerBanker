import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    let resolvedUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(resolvedUrl)) {
      const rawBase =
        process.env.NEXT_PUBLIC_BASE_URL ||
        "https://charissa-intuitable-corroboratorily.ngrok-free.dev/";
      const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
      resolvedUrl = new URL(resolvedUrl.replace(/^\/+/, ""), base).toString();
    }

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const upstreamResponse = await fetch(resolvedUrl, {
      headers,
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      return new NextResponse(`Upstream error: ${upstreamResponse.statusText}`, {
        status: upstreamResponse.status,
      });
    }

    const urlLower = resolvedUrl.toLowerCase();
    let detectedContentType = upstreamResponse.headers.get("content-type");

    // Override generic / html / text types if file extension is unambiguous
    if (urlLower.endsWith(".pdf")) {
      detectedContentType = "application/pdf";
    } else if (urlLower.endsWith(".png")) {
      detectedContentType = "image/png";
    } else if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg")) {
      detectedContentType = "image/jpeg";
    } else if (urlLower.endsWith(".webp")) {
      detectedContentType = "image/webp";
    } else if (urlLower.endsWith(".svg")) {
      detectedContentType = "image/svg+xml";
    } else if (urlLower.endsWith(".docx")) {
      detectedContentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (!detectedContentType || detectedContentType.includes("text/html")) {
      detectedContentType = "application/octet-stream";
    }

    const buffer = await upstreamResponse.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": detectedContentType,
        "Content-Disposition": "inline",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Failed to proxy document:", error);
    return new NextResponse(
      `Proxy error: ${error?.message || "Unknown error"}`,
      { status: 500 },
    );
  }
}
