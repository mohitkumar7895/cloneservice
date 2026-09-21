import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SEO_LOCATIONS } from "../../lib/seo-locations";

export const metadata: Metadata = {
  title: "Appliance Repair Service Areas | Noida, Delhi, Gaur City 2",
  description: "PROVISIONINGTECH Company doorstep appliance repair locations across Delhi NCR including Noida, Greater Noida, Ghaziabad, Gurgaon and Gaur City 2.",
  robots: { index: false, follow: false },
};

export default function SitemapPages() {
  const locations = SEO_LOCATIONS.map((loc) => ({ title: loc.title, path: `/${loc.slug}` }));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Service Locations</h1>
        <p className="text-gray-600 mb-8">Browse all our dedicated service areas where we offer doorstep appliance repair.</p>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
            <h2 className="font-bold text-emerald-900">Available Areas</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {locations.map((loc, idx) => (
              <li key={idx}>
                <Link 
                  href={loc.path}
                  className="flex items-center justify-between px-6 py-4 hover:bg-emerald-50/50 transition-colors group"
                >
                  <span className="font-medium text-gray-800 group-hover:text-emerald-700">{loc.title}</span>
                  <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
