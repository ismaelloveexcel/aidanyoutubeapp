/**
 * YouTube OAuth Integration
 * 
 * This module handles YouTube OAuth authentication flow.
 * 
 * Required environment variables:
 * - YOUTUBE_CLIENT_ID: Google OAuth client ID
 * - YOUTUBE_CLIENT_SECRET: Google OAuth client secret
 * - YOUTUBE_REDIRECT_URI: OAuth redirect URI (e.g., http://localhost:5000/api/auth/youtube/callback)
 * 
 * To set up:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com)
 * 2. Create a new project or select existing one
 * 3. Enable YouTube Data API v3
 * 4. Create OAuth 2.0 credentials
 * 5. Add authorized redirect URIs
 * 6. Copy Client ID and Client Secret to your environment variables
 */

import { OAuth2Client } from "google-auth-library";

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || "http://localhost:5000/api/auth/youtube/callback";

// OAuth scopes needed for YouTube integration
const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

let oauth2Client: OAuth2Client | null = null;

if (YOUTUBE_CLIENT_ID && YOUTUBE_CLIENT_SECRET) {
  oauth2Client = new OAuth2Client(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_REDIRECT_URI
  );
}

/**
 * Check if YouTube OAuth is configured
 */
export function isYouTubeAuthConfigured(): boolean {
  return oauth2Client !== null;
}

/**
 * Get the OAuth authorization URL for YouTube
 */
export function getYouTubeAuthUrl(): string | null {
  if (!oauth2Client) {
    return null;
  }

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: YOUTUBE_SCOPES,
    prompt: "consent", // Always ask for consent to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiryDate?: number;
} | null> {
  if (!oauth2Client) {
    return null;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return {
      accessToken: tokens.access_token || "",
      refreshToken: tokens.refresh_token || undefined,
      expiryDate: tokens.expiry_date || undefined,
    };
  } catch (error) {
    console.error("Failed to exchange code for tokens:", error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiryDate?: number;
} | null> {
  if (!oauth2Client) {
    return null;
  }

  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return {
      accessToken: credentials.access_token || "",
      expiryDate: credentials.expiry_date || undefined,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}

/**
 * Get user's YouTube channel info
 */
export async function getChannelInfo(accessToken: string): Promise<{
  channelId: string;
  channelTitle: string;
  subscriberCount: string;
  videoCount: string;
  thumbnailUrl: string;
} | null> {
  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    return {
      channelId: channel.id,
      channelTitle: channel.snippet?.title || "Unknown Channel",
      subscriberCount: channel.statistics?.subscriberCount || "0",
      videoCount: channel.statistics?.videoCount || "0",
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url || "",
    };
  } catch (error) {
    console.error("Failed to get channel info:", error);
    return null;
  }
}
