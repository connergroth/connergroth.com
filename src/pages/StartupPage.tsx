import PageLayout from '../components/PageLayout';
import LucenceLabs from '../sections/LucenceLabs';

const StartupPage = () => (
  <PageLayout title="Startup" description="Lucence Labs - A student-led software startup building AI-powered tools. Home of Sift, an intelligent iMessage AI assistant.">
    <div className="pt-32 pb-24">
      <LucenceLabs className="opacity-100" />
    </div>
  </PageLayout>
);

export default StartupPage;
