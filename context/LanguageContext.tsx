import { createContext } from "react";

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
  }
const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: ()=>{}
})

export default LanguageContext;