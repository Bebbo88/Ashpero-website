import OffersPage from "@/components/offers/OffersPage";

// ISR: Offers generated statically but refreshed daily
export const revalidate = 86400;

export const metadata = {
  title: 'Winter Radiance Sale | Ashpero',
  description: 'Discover luxury skincare formulas at special pricing in our Winter Radiance Sale.',
};

export default function Offers() {
  return <OffersPage />;
}
