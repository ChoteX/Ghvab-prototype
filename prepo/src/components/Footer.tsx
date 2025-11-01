import { GraduationCap } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Navigation",
      links: ["Home", "Browse", "My Library", "Favorites"]
    },
    {
      title: "Resources",
      links: ["Help Center", "Study Guides", "Practice Tests", "Video Tutorials"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"]
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Contact Us"]
    }
  ];

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CourseMate
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 CourseMate. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
