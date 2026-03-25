import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

// ISR: Statically generated and fast, but revalidated hourly as featured products/promos might change
export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      <Navbar />
      <Footer />
    </main>
  );
}
