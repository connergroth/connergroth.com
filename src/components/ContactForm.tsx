import React, { useState, FormEvent } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xgvarknn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        
        // Reset form after showing success state
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            message: ''
          });
          setIsSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {isSuccess && (
        <div className="bg-primary/10 p-4 mb-6 rounded-md text-center border border-primary/20">
          <p className="text-primary font-sans font-medium">Message sent successfully!</p>
          <p className="text-gray-300 font-sans text-sm mt-1">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-sans font-medium mb-2 text-gray-300">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name" 
            className="w-full px-4 py-2 bg-[#070a0d] bg-opacity-60 border border-gray-800 rounded-md focus:outline-none focus:border-gray-600 font-sans"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-sans font-medium mb-2 text-gray-300">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email" 
            className="w-full px-4 py-2 bg-[#070a0d] bg-opacity-60 border border-gray-800 rounded-md focus:outline-none focus:border-gray-600 font-sans"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-sans font-medium mb-2 text-gray-300">Message</label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            rows={4}
            className="w-full px-4 py-2 bg-[#070a0d] bg-opacity-60 border border-gray-800 rounded-md focus:outline-none focus:border-gray-600 resize-none font-sans"
            required
          ></textarea>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            type="submit" 
            className="relative h-12 px-6 flex justify-center items-center w-full md:w-auto transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            <div className="absolute inset-0 bg-[#070a0d] border border-primary rounded-md"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md"></div>
            <div className="text-center text-primary text-sm font-sans font-medium z-10 flex items-center">
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send Message
                </>
              )}
            </div>
          </button>
          
          <a 
            href="mailto:connergroth@gmail.com" 
            className="relative h-12 px-6 flex justify-center items-center w-full md:w-auto transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-[#070a0d] border border-primary rounded-md"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 rounded-md"></div>
            <div className="text-center text-primary text-sm font-sans font-medium z-10 flex items-center">
              <svg className="w-4 h-4 mr-2 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </svg>
              Email Me Directly
            </div>
          </a>
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 