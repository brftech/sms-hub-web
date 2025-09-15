import { useEffect } from "react";
import { getSupabaseClient } from "../lib/supabaseSingleton";

export default function ClearAuth() {
  useEffect(() => {
    const clearAuth = async () => {
      console.log("Clearing auth session...");
      
      // Clear Supabase session
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      
      // Clear all localStorage items related to Supabase
      if (typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            console.log('Removing:', key);
            localStorage.removeItem(key);
          }
        });
      }
      
      // Clear sessionStorage too
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      
      console.log("Auth cleared!");
      
      // Redirect to home after a moment
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    };
    
    clearAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Authentication...</h1>
        <p className="text-gray-600">Please wait while we clear your session.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}