import PageLayout from '../components/PageLayout';
import Projects from '../sections/Projects';

const ProjectsPage = () => (
  <PageLayout title="Projects" description="Conner Groth's AI, ML, and software engineering projects including Sift, Timbrality, SeqImprove, and more.">
    <div className="pt-32 pb-24">
      <Projects className="opacity-100" />
    </div>
  </PageLayout>
);

export default ProjectsPage;
