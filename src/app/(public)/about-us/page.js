import AboutUsClient from './AboutUsClient';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = {
  title: 'About Us | Ashpero',
  description: 'Learn more about Ashpero, our values, and our mission.',
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
