import React, { useState, FormEvent, useRef } from 'react';
import SectionHeading from './SectionHeading';
import { Mail, Linkedin, Github, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import confetti from 'canvas-confetti';
import ContactForm from './HeroContactForm';

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
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

  const triggerConfetti = () => {
    const canvasElement = document.createElement('canvas');
    canvasElement.style.position = 'fixed';
    canvasElement.style.inset = '0';
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    canvasElement.style.pointerEvents = 'none';
    canvasElement.style.zIndex = '9999';
    document.body.appendChild(canvasElement);

    const myConfetti = confetti.create(canvasElement, {
      resize: true,
      useWorker: true
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      document.body.removeChild(canvasElement);
    }, 3000);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
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
        triggerConfetti();
        
        toast({
          title: "Message sent successfully!",
          description: "Thank you for reaching out. I'll get back to you soon!",
          variant: "success"
        });
        
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
      toast({
        title: "Something went wrong",
        description: "Unable to send your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: "Email",
      value: "connergroth@gmail.com",
      link: "mailto:connergroth@gmail.com",
      icon: <Mail className="w-5 h-5" />
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/in/connergroth",
      link: "https://linkedin.com/in/connergroth",
      icon: <Linkedin className="w-5 h-5" />
    },
    {
      title: "GitHub",
      value: "github.com/connergroth",
      link: "https://github.com/connergroth",
      icon: <Github className="w-5 h-5" />
    }
  ];

  return (
    <section id="contact" className="section-padding bg-accent-1/10 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <SectionHeading subtitle="Get In Touch" title="Say Hello" />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-16">
          {/* Contact Information */}
          <div className="lg:col-span-2 reveal">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[hsl(var(--border))]/30 h-full">
              <h3 className="text-xl font-heading font-bold mb-8 text-gradient">Let's Connect</h3>
              
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-5 group">
                    <div className="btn-icon-outline flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <a 
                        href={item.link} 
                        target={item.title !== "Email" ? "_blank" : undefined} 
                        rel={item.title !== "Email" ? "noopener noreferrer" : undefined}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10">
                <p className="text-[15px] text-foreground/80 leading-relaxed">
                  Whether you have a project in mind, job opportunity, or just want to say hi, I'd love to hear from you!
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-3 reveal reveal-delay-200">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[hsl(var(--border))]/30 relative overflow-hidden">
              <h3 className="text-xl font-heading font-bold mb-6 text-gradient">Send Me A Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 