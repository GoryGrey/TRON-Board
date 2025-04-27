import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Received file: ${file.name}, size: ${file.size}, type: ${file.type}`)

    // Determine folder based on referrer or default to "uploads"
    let folder = "uploads"
    const referrer = request.headers.get("referer") || ""

    if (referrer.includes("/admin")) {
      folder = "ads"
    }

    console.log(`Uploading file to folder: ${folder}`)

    const result = await uploadImage(file, folder)
    console.log("Upload result:", result)

    // Ensure the URL is properly formatted
    let url = result.path

    // If the URL doesn't start with http or /, add the public URL prefix
    if (!url.startsWith("http") && !url.startsWith("/")) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      url = `${supabaseUrl}/storage/v1/object/public/${result.bucket}/${result.path}`
    }

    console.log("Upload successful, returning URL:", url)

    return NextResponse.json({
      success: true,
      url: url,
      path: result.path,
      bucket: result.bucket,
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
