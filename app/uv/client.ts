export const runtime = "edge"

export async function GET() {
  try {
    // Fetch the Ultraviolet client from the CDN
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@1.0.10/dist/uv.client.js",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch client: ${response.status}`)
    }

    const text = await response.text()

    return new Response(text, {
      headers: {
        "content-type": "application/javascript",
        "cache-control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching client:", error)
    // Return a minimal client to prevent errors
    return new Response(
      `window.__uv = { config: { prefix: '/uv/', bare: '/bare/', encodeUrl: url => url, decodeUrl: url => url } };`,
      {
        headers: {
          "content-type": "application/javascript",
        },
      },
    )
  }
}
