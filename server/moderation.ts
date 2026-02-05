// Kid-safe content moderation for TubeStar with prompt injection protection
const INAPPROPRIATE_PATTERNS = [
  /\b(kill|murder|stab|shoot|gun|weapon|blood|gore|dead|death|suicide|cutting)\b/gi,
  /\b(sex|nude|naked|porn|xxx|adult|18\+|nsfw)\b/gi,
  /\b(fuck|shit|damn|hell|ass|bitch|crap|piss|bastard)\b/gi,
  /f+u+c+k+/gi,
  /s+h+i+t+/gi,
  /\b(hate|stupid|idiot|dumb|loser|ugly|fat|retard)\b/gi,
  /\b(drug|weed|marijuana|cocaine|meth|alcohol|beer|wine|drunk|high|vape|smoke)\b/gi,
  /\b(dangerous|hurt yourself|self.?harm)\b/gi,
];

// Prompt injection patterns (if AI features are added later)
const PROMPT_INJECTION_PATTERNS = [
  /ignore (previous|above|all|the)\s+(instruction|prompt|rule)/gi,
  /disregard (previous|above|all|the)\s+(instruction|prompt|rule)/gi,
  /forget (previous|above|all|the)\s+(instruction|prompt|rule)/gi,
  /you are now/gi,
  /system:\s*you/gi,
  /new instructions?:/gi,
  /override (previous|above|all|the)\s+(instruction|prompt|rule)/gi,
  /<\s*script/gi, // XSS attempts
  /javascript:/gi,
  /on(load|error|click|mouse)/gi, // Event handlers
];

const FRIENDLY_ALTERNATIVES = ["awesome stuff", "cool things", "amazing content", "epic moments", "fun times"];

export interface ModerationResult {
  isClean: boolean;
  originalText: string;
  cleanedText?: string;
  blockedReasons?: string[];
}

export function checkTextSafety(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return { isClean: true, originalText: text || '' };
  }
  const blockedReasons: string[] = [];
  let cleanedText = text;
  let foundIssue = false;
  
  // Check for prompt injection attempts
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      foundIssue = true;
      blockedReasons.push('suspicious input detected');
      cleanedText = cleanedText.replace(pattern, '[filtered]');
    }
    pattern.lastIndex = 0;
  }
  
  // Check for inappropriate content
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      foundIssue = true;
      blockedReasons.push('inappropriate content detected');
      const replacement = FRIENDLY_ALTERNATIVES[Math.floor(Math.random() * FRIENDLY_ALTERNATIVES.length)];
      cleanedText = cleanedText.replace(pattern, `[${replacement}]`);
    }
    pattern.lastIndex = 0;
  }
  
  // Log suspicious inputs for admin review
  if (foundIssue && process.env.NODE_ENV === 'production') {
    console.warn('[MODERATION] Blocked content:', {
      timestamp: new Date().toISOString(),
      reasons: blockedReasons,
      snippet: text.substring(0, 50),
    });
  }
  
  return {
    isClean: !foundIssue,
    originalText: text,
    cleanedText: foundIssue ? cleanedText : undefined,
    blockedReasons: foundIssue ? Array.from(new Set(blockedReasons)) : undefined,
  };
}

export function ensureKidSafeText(texts: string[]): { allClean: boolean; results: ModerationResult[]; errorMessage?: string; } {
  const results = texts.map(text => checkTextSafety(text));
  const allClean = results.every(r => r.isClean);
  return {
    allClean,
    results,
    errorMessage: allClean ? undefined : "Oops! Some words aren't allowed. Let's keep it fun and friendly!",
  };
}

export function moderateObject<T extends Record<string, any>>(obj: T): { isClean: boolean; errorMessage?: string; } {
  const textValues: string[] = [];
  function extractStrings(value: any): void {
    if (typeof value === 'string') textValues.push(value);
    else if (Array.isArray(value)) value.forEach(extractStrings);
    else if (value && typeof value === 'object') Object.values(value).forEach(extractStrings);
  }
  extractStrings(obj);
  const { allClean, errorMessage } = ensureKidSafeText(textValues);
  return { isClean: allClean, errorMessage };
}
