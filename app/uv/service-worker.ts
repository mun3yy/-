export const runtime = "edge"

export async function GET() {
  try {
    // Fetch the Ultraviolet service worker from the CDN
    const response = await fetch("https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@1.0.10/dist/uv.sw.js")

    if (!response.ok) {
      throw new Error(`Failed to fetch service worker: ${response.status}`)
    }

    const text = await response.text()

    return new Response(text, {
      headers: {
        "content-type": "application/javascript",
        "service-worker-allowed": "/",
        "cache-control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching service worker:", error)
    // Return a minimal service worker to prevent errors
    return new Response(
      `self.addEventListener('fetch', event => {
        event.respondWith(fetch(event.request));
      });`,
      {
        headers: {
          "content-type": "application/javascript",
          "service-worker-allowed": "/",
        },
      },
    )
  }
}
