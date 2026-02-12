import PageLayout from '../components/PageLayout';
import Contact from '../sections/Contact';

const ContactPage = () => (
  <PageLayout title="Contact" description="Get in touch with Conner Groth for job opportunities, project ideas, or collaboration.">
    <div className="pt-32 pb-24">
      <Contact className="opacity-100" />
    </div>
  </PageLayout>
);

export default ContactPage;
