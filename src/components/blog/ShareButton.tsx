import { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Échec de la copie');
    }
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://www.facebook.com/eliadenumber1', 
      color: 'hover:text-[#1877F2]' 
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/eliade_kibangoudmboungou', 
      color: 'hover:text-[#E4405F]' 
    },
    { 
      name: 'X', 
      icon: Twitter, 
      url: 'https://x.com/Eliade_K_M', 
      color: 'hover:text-black' 
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Nous suivre
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Suivez-nous sur</p>

          {/* Copier le lien */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {copied 
                ? <Check className="h-4 w-4 text-green-500" /> 
                : <LinkIcon className="h-4 w-4 text-primary" />
              }
            </div>
            <span className="text-sm font-medium text-foreground">
              {copied ? 'Copié !' : 'Copier le lien'}
            </span>
          </button>

          {/* Réseaux sociaux */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-colors ${social.color}`}
                title={`Visiter ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
