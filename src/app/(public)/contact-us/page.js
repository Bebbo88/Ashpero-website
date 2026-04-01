import ContactUsClient from './ContactUsClient';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = {
  title: 'Contact Us | Ashpero',
  description: 'Get in touch with the Ashpero team.',
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}
