
/**
 * Cleans up all authentication state from local storage
 * This helps prevent authentication limbo states where tokens
 * are partially preserved or in conflict
 */
export const cleanupAuthState = () => {
  console.log("Cleaning up auth state");

  // Identify and remove all Supabase auth-related keys
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith('sb-') || 
      key.startsWith('supabase.auth.') ||
      key.includes('auth') ||
      key.includes('token')
    ) {
      console.log("Removing auth-related key:", key);
      localStorage.removeItem(key);
    }
  });

  // Also check sessionStorage if available
  if (window.sessionStorage) {
    Object.keys(sessionStorage).forEach((key) => {
      if (
        key.startsWith('sb-') || 
        key.startsWith('supabase.auth.') ||
        key.includes('auth') ||
        key.includes('token')
      ) {
        console.log("Removing auth-related key from sessionStorage:", key);
        sessionStorage.removeItem(key);
      }
    });
  }
};
