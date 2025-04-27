import { AdDisplay } from "@/components/ad-display"

export default function ExampleWithAds() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">Main Content</h1>
          <p>This is the main content area of the page.</p>

          {/* More content here */}
          <div className="h-96 border rounded p-4">
            <p>Content continues here...</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Sponsored</h2>
          <AdDisplay limit={2} />

          <h2 className="text-xl font-semibold mt-8">Related Content</h2>
          <div className="border rounded p-4">
            <p>Related content here...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
