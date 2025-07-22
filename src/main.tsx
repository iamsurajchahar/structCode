import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from '@/integrations/supabase/client'

if (import.meta.env.MODE === 'development') {
  // @ts-ignore - Intentionally exposing for debugging
  window.supabase = supabase;
  console.log('Supabase client exposed to window.supabase for debugging');
}

createRoot(document.getElementById("root")!).render(<App />);
