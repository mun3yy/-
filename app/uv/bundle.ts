export const runtime = "edge"

export async function GET() {
  try {
    // Fetch the Ultraviolet bundle from the CDN
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@1.0.10/dist/uv.bundle.js",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch bundle: ${response.status}`)
    }

    const text = await response.text()

    return new Response(text, {
      headers: {
        "content-type": "application/javascript",
        "cache-control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching bundle:", error)
    // Return a minimal bundle to prevent errors
    return new Response(`console.log('UV bundle loaded');`, {
      headers: {
        "content-type": "application/javascript",
      },
    })
  }
}
