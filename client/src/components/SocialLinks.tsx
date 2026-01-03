import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Facebook,
  Instagram
} from "lucide-react";

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  url: string;
}

interface SocialLinksProps {
  personalInfo: {
    github: string;
    linkedin: string;
    email: string;
    facebook?: string;
    instagram?: string;
  };
}

export function SocialLinks({ personalInfo }: SocialLinksProps) {
  const links: SocialLink[] = [
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      url: personalInfo.github
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      url: personalInfo.linkedin
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      url: `mailto:${personalInfo.email}`
    },
    ...(personalInfo.facebook ? [{
      icon: <Facebook className="w-5 h-5" />,
      label: "Facebook",
      url: personalInfo.facebook
    }] : []),
    ...(personalInfo.instagram ? [{
      icon: <Instagram className="w-5 h-5" />,
      label: "Instagram",
      url: personalInfo.instagram
    }] : []),
  ];

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {links.map((link, index) => (
        <motion.a
          key={link.label}
          href={link.url}
          target={link.url.startsWith('mailto:') ? undefined : "_blank"}
          rel={link.url.startsWith('mailto:') ? undefined : "noopener noreferrer"}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-card rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all shadow-lg hover:shadow-primary/20"
          aria-label={link.label}
          title={link.label}
        >
          <span className="text-foreground hover:text-primary transition-colors">
            {link.icon}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
