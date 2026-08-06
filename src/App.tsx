import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import Index from './pages/Index';

/* One page, no router. Vercel rewrites every path to index.html, so an old
   /work/:slug link still lands here instead of 404ing — the project links now
   point at the real products, so there are no inner pages left to route to. */
const App = () => (
  <HelmetProvider>
    <div className="min-h-svh bg-[#FBFBFA]">
      <Index />
    </div>
    <Analytics
      beforeSend={(event) =>
        typeof window !== 'undefined' && localStorage.getItem('va-ignore')
          ? null
          : event
      }
    />
  </HelmetProvider>
);

export default App;
