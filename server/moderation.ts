// Kid-safe content moderation for TubeStar
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
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      foundIssue = true;
      blockedReasons.push('inappropriate content detected');
      const replacement = FRIENDLY_ALTERNATIVES[Math.floor(Math.random() * FRIENDLY_ALTERNATIVES.length)];
      cleanedText = cleanedText.replace(pattern, `[${replacement}]`);
    }
    pattern.lastIndex = 0;
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
