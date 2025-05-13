import React from 'react';
import ContactForm from '../components/ContactForm';

interface ContactProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Contact: React.FC<ContactProps> = ({ id = 'contact', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '0.01em' }}>G</span><span style={{ letterSpacing: '0.01em' }}>e</span>t In Touch</h1>
      <h2 className="text-lg sm:text-xl font-normal">Got a project idea, job opportunity, or just want to say hi? I'd love to hear from you!</h2>
      <h3 className="mt-2 text-gray-400">Timezone: <b>GMT-6</b>, Boulder/USA</h3>

      <div className="mt-8 max-w-2xl">
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact; 