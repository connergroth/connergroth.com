import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function SideBars() {
  const iconClasses = "w-6 h-6 transition-colors text-gray-400 hover:text-white";
  return (
    <>
      {/* Social column */}
      <ul className="fixed bottom-0 left-8 flex flex-col items-center gap-4 z-50 select-none">
        <li><a className={iconClasses} aria-label="GitHub" href="https://github.com/connergroth" target="_blank" rel="noreferrer"><Github /></a></li>
        <li><a className={iconClasses} aria-label="LinkedIn" href="https://linkedin.com/in/connergroth" target="_blank" rel="noreferrer"><Linkedin /></a></li>
        <li><a className={iconClasses} aria-label="Email" href="mailto:conner.groth@gmail.com"><Mail /></a></li>
        <span className="mt-4 text-[0.7rem] tracking-widest text-gray-500 rotate-180 writing-mode-vertical-rl">Socials:</span>
        <span className="block w-px h-24 bg-gray-500 mt-3" />
      </ul>

      {/* Email column */}
      <div className="fixed bottom-0 right-8 flex flex-col items-center z-50">
        <a href="mailto:conner.groth@gmail.com"
           className="rotate-180 writing-mode-vertical-rl text-sm tracking-widest text-gray-400 hover:text-white select-none transition-colors">
          conner.groth@gmail.com
        </a>
        <span className="block w-px h-24 bg-gray-500 mt-2" />
      </div>
    </>
  );
} 