import ContactUsClient from "./ContactUsClient";

export const metadata = {
  title: "Contact Us | Ashperoo",
  description: "Get in touch with the Ashpero team.",
};

export const dynamic = "force-static";
export const revalidate = 86400;

export default function ContactUsPage() {
  return <ContactUsClient />;
}
