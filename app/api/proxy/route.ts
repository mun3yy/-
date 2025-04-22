import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    // Fetch the target URL
    const response = await fetch(url)

    // Get the content type
    const contentType = response.headers.get("content-type") || "text/html"

    // Get the response body
    let body = await response.text()

    // If it's HTML, modify it to proxy all links and resources
    if (contentType.includes("text/html")) {
      // Replace all absolute URLs with proxied URLs
      body = body.replace(/(href|src|action)=["'](https?:\/\/[^"']+)["']/gi, (match, attr, targetUrl) => {
        return `${attr}="/proxy?url=${encodeURIComponent(targetUrl)}"`
      })

      // Add base tag to handle relative URLs
      body = body.replace(/<head>/i, `<head><base href="${url}">`)

      // Add proxy script to handle dynamic content
      body = body.replace(
        /<\/body>/i,
        `<script>
          // Intercept fetch requests
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            if (url.startsWith('http')) {
              return originalFetch('/proxy?url=' + encodeURIComponent(url), options);
            }
            return originalFetch(url, options);
          }
        </script></body>`,
      )
    }

    // Return the modified response
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 })
  }
}
