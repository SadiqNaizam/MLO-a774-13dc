import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Example social icons

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">ServicePlatform</h3>
            <p className="text-sm text-muted-foreground">
              Connecting you with trusted local service providers.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-muted-foreground hover:text-primary">Find Services</Link></li>
              <li><Link to="/how-it-works-client" className="text-muted-foreground hover:text-primary">How It Works</Link></li>
              <li><Link to="/post-job" className="text-muted-foreground hover:text-primary">Post a Job</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">Client FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/join-provider" className="text-muted-foreground hover:text-primary">Become a Provider</Link></li>
              <li><Link to="/how-it-works-provider" className="text-muted-foreground hover:text-primary">How It Works</Link></li>
              <li><Link to="/provider-faq" className="text-muted-foreground hover:text-primary">Provider FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-muted-foreground">&copy; {currentYear} ServicePlatform. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
            <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;