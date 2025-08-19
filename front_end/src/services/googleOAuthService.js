// Google OAuth service
class GoogleOAuthService {
  constructor() {
    this.clientId = this.getClientId();
    this.isInitialized = false;
    this.gapi = null;
  }

  getClientId() {
    // Determine client ID based on environment
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // Development environment - you'll need to set your actual client ID
      return (
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "your-development-client-id.apps.googleusercontent.com"
      );
    } else if (hostname === "pritechvior.co.tz") {
      // Production environment
      return (
        import.meta.env.VITE_GOOGLE_CLIENT_ID_PROD ||
        "your-production-client-id.apps.googleusercontent.com"
      );
    } else {
      // Default fallback
      return (
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "your-default-client-id.apps.googleusercontent.com"
      );
    }
  }

  async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google) {
          resolve(window.google);
        } else {
          reject(new Error("Google API failed to load"));
        }
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google API script"));
      };

      document.head.appendChild(script);
    });
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadGoogleAPI();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Google OAuth:", error);
      throw error;
    }
  }

  async signIn() {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response) => {
            if (response.credential) {
              resolve(response.credential);
            } else {
              reject(new Error("Google authentication failed"));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        // Create a temporary div for the button
        const buttonContainer = document.createElement("div");
        buttonContainer.style.position = "fixed";
        buttonContainer.style.top = "-9999px";
        buttonContainer.style.left = "-9999px";
        document.body.appendChild(buttonContainer);

        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signup_with",
          click_listener: () => {
            // Remove the hidden button
            document.body.removeChild(buttonContainer);
          },
        });

        // Trigger the button click
        setTimeout(() => {
          const button = buttonContainer.querySelector('[role="button"]');
          if (button) {
            button.click();
          } else {
            document.body.removeChild(buttonContainer);
            // Fallback to prompt
            window.google.accounts.id.prompt((notification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                reject(new Error("Google authentication was not available"));
              }
            });
          }
        }, 100);
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  async showPopup() {
    // This method is kept for compatibility but uses the same flow as signIn
    return this.signIn();
  }

  async signUp() {
    // For signup, we use the same flow as sign-in
    // The backend will determine if it's a new user or existing user
    return this.signIn();
  }

  // Parse the JWT token to get user info (for display purposes only)
  parseJWT(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  }
}

export default new GoogleOAuthService();
