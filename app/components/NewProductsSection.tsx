import { Inbox } from "lucide-react";

export default function NewProductsSection() {
  return (
    <section className="bg-white py-12 px-6 lg:px-12 w-full border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1e293b] inline-block relative pb-1">
            New Products
            <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"></div>
          </h2>
        </div>

        {/* Coming Soon Box */}
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative group cursor-pointer">
          <img src="/new_products_banner.jpg" alt="New Products Coming Soon" className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white text-xl font-bold mb-1">Coming Soon</h3>
            <p className="text-emerald-50 text-sm">Stay tuned for our latest premium appliance collection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
