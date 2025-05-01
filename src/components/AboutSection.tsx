import React from 'react';
import SectionHeading from './SectionHeading';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-padding bg-secondary/10">
      <div className="container mx-auto">
        <SectionHeading subtitle="Get To Know More" title="About Me" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
          {/* Bio */}
          <div className="reveal lg:col-span-2 bg-card rounded-2xl p-6 shadow-lg card-hover-outline">
            <h2 className="text-xl font-semibold mb-4 text-gradient">Who I Am</h2>
            <div className="space-y-4 text-foreground/90">
              <p>
                I'm a Computer Science student at CU Boulder passionate about building scalable, data-driven 
                applications that integrate machine learning, AI, and APIs to deliver impactful user experiences.
              </p>
              <p>
                I specialize in full-stack development, working with Python, C++, JavaScript (React, Next.js), 
                FastAPI, and PostgreSQL to develop efficient, user-centric software. My experience spans backend 
                architecture, database design, and AI-powered applications that leverage real-world data.
              </p>
              <p>
                I'm driven to create intuitive, efficient applications that solve real-world problems. 
                My academic journey has equipped me with strong analytical skills and a solid foundation 
                in computer science principles, while my ongoing projects allow me to apply these skills 
                in practical scenarios.
              </p>
              <p>
                When I'm not coding, you can find me lifting weights, taking photos, and skiing.
              </p>
            </div>
          </div>
          
          {/* Education Cards */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="reveal reveal-delay-200 bg-card rounded-2xl p-6 shadow-lg card-hover-outline">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <img 
                    src="./assets/culogo.png" 
                    alt="CU Boulder Logo"
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = './assets/gradcap.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bachelor of Science</h3>
                  <h4 className="text-primary">Computer Science</h4>
                  <p className="text-sm text-foreground/80 mt-1">University of Colorado Boulder</p>
                  <p className="text-sm text-foreground/80">School of Engineering & Applied Science</p>
                  <p className="text-sm mt-2 font-medium">Expected: 2027</p>
                  <p className="text-xs mt-3 text-foreground/70">Key Courses: Data Structures & Algorithms, Software Development Methods & Tools, Computer Systems</p>
                </div>
              </div>
            </div>
            
            <div className="reveal reveal-delay-400 bg-card rounded-2xl p-6 shadow-lg card-hover-outline">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <img 
                    src="./assets/culogo.png" 
                    alt="CU Boulder Business School Logo"
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = './assets/github.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Minor</h3>
                  <h4 className="text-primary">Business</h4>
                  <p className="text-sm text-foreground/80 mt-1">University of Colorado Boulder</p>
                  <p className="text-sm text-foreground/80">Leeds School of Business</p>
                  <p className="text-sm mt-2 font-medium">Expected: 2027</p>
                  <p className="text-xs mt-3 text-foreground/70">Key Courses: Marketing, Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 