import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { getSupportedLanguages, saveLanguagePreference } from '@/utils/languageDetection';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const supportedLanguages = getSupportedLanguages();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    saveLanguagePreference(languageCode);
    setIsOpen(false);
  };

  const currentLanguage = supportedLanguages.find(
    lang => lang.code === i18n.language
  ) || supportedLanguages[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center justify-between ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
          >
            <span>{language.nativeName}</span>
            <span className="text-sm text-muted-foreground">
              {language.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
