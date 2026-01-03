import { useState } from "react";
import { useLocation } from "wouter";
import { AVATARS } from "@/lib/creator-profile";
import "./login.css";

// Default avatar for new users
const DEFAULT_AVATAR = AVATARS[0];

export default function Login() {
  const [creatorName, setCreatorName] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorName.trim()) {
      // Store the creator name in localStorage for the profile
      const profile = { name: creatorName.trim(), channelName: '', avatar: DEFAULT_AVATAR };
      localStorage.setItem('tubestar-profile', JSON.stringify(profile));
      // Navigate to dashboard
      setLocation("/");
    }
  };

  const handleSkip = () => {
    // Navigate to dashboard without setting up profile
    setLocation("/");
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit}>
        <p id="heading">Welcome to TubeStar! ⭐</p>
        <div className="field">
          <svg
            className="input-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
          </svg>
          <input
            autoComplete="off"
            placeholder="What's your name, creator?"
            className="input-field"
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="btn">
          <button type="submit" className="button1">
            Let's Go! 🚀
          </button>
          <button type="button" className="button2" onClick={handleSkip}>
            Skip for Now
          </button>
        </div>
      </form>
    </div>
  );
}
