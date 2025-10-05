export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📍 User location data received:", body);

    // Optional: Email, database, or file save logic yahan likh sakte ho
    return Response.json({ message: "Location received successfully!" });
  } catch (error) {
    console.error("Error saving location:", error);
    return new Response("Error saving location", { status: 500 });
  }
}
