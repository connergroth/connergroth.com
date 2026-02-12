import PageLayout from '../components/PageLayout';
import Work from '../sections/Work';

const WorkPage = () => (
  <PageLayout title="Work" description="Conner Groth's professional and leadership experience in software engineering, AI, and research.">
    <div className="pt-32 pb-24">
      <Work className="opacity-100" />
    </div>
  </PageLayout>
);

export default WorkPage;
