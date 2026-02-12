import PageLayout from '../components/PageLayout';
import About from '../sections/About';

const AboutPage = () => (
  <PageLayout title="About" description="Learn about Conner Groth - Software Engineer, CS Student, and Undergraduate Researcher based in Boulder, CO.">
    <div className="pt-32 min-h-screen">
      <About className="opacity-100" />
    </div>
  </PageLayout>
);

export default AboutPage;
