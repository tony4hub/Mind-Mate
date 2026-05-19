export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'critical' | 'high' | 'medium' | 'none';
  detectedKeywords: string[];
  confidence: number;
  recommendedAction: 'immediate_intervention' | 'show_resources' | 'monitor';
}

export interface CrisisKeywordConfig {
  critical: string[];
  high: string[];
  medium: string[];
}

const DEFAULT_CRISIS_KEYWORDS: CrisisKeywordConfig = {
  critical: [
    'suicide', 'kill myself', 'end it all', 'want to die', 'going to die',
    'take my life', 'end my life', 'better off dead', 'no point living',
    'can\'t go on', 'want to disappear', 'end the pain'
  ],
  high: [
    'harm myself', 'hurt myself', 'murder', 'kill someone', 'kill them',
    'going to hurt', 'make them pay', 'they deserve to die', 'violence',
    'weapon', 'gun', 'knife', 'poison'
  ],
  medium: [
    'hopeless', 'worthless', 'useless', 'burden', 'hate myself',
    'can\'t take it', 'give up', 'no hope', 'pointless', 'empty inside',
    'numb', 'lost', 'alone forever'
  ]
};

export class CrisisDetectionService {
  private keywords: CrisisKeywordConfig;

  constructor(customKeywords?: Partial<CrisisKeywordConfig>) {
    this.keywords = {
      critical: [...DEFAULT_CRISIS_KEYWORDS.critical, ...(customKeywords?.critical || [])],
      high: [...DEFAULT_CRISIS_KEYWORDS.high, ...(customKeywords?.high || [])],
      medium: [...DEFAULT_CRISIS_KEYWORDS.medium, ...(customKeywords?.medium || [])]
    };
  }

  detectCrisis(message: string, conversationHistory?: string[]): CrisisDetectionResult {
    const lowerMessage = message.toLowerCase();
    const detectedKeywords: string[] = [];
    let highestSeverity: 'critical' | 'high' | 'medium' | 'none' = 'none';
    let confidence = 0;

    // Check critical keywords first
    for (const keyword of this.keywords.critical) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
        highestSeverity = 'critical';
        confidence = Math.max(confidence, 0.95);
      }
    }

    // Check high severity keywords if no critical found
    if (highestSeverity === 'none') {
      for (const keyword of this.keywords.high) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
          highestSeverity = 'high';
          confidence = Math.max(confidence, 0.85);
        }
      }
    }

    // Check medium severity keywords if no high found
    if (highestSeverity === 'none') {
      for (const keyword of this.keywords.medium) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
          highestSeverity = 'medium';
          confidence = Math.max(confidence, 0.70);
        }
      }
    }

    // Enhance confidence based on context patterns
    if (detectedKeywords.length > 1) {
      confidence = Math.min(confidence + 0.1, 1.0);
    }

    // Check conversation history for escalating patterns
    if (conversationHistory && conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-3).join(' ').toLowerCase();
      const escalationPatterns = ['getting worse', 'can\'t handle', 'too much', 'breaking point'];
      
      for (const pattern of escalationPatterns) {
        if (recentMessages.includes(pattern)) {
          confidence = Math.min(confidence + 0.05, 1.0);
          if (highestSeverity === 'medium') highestSeverity = 'high';
          if (highestSeverity === 'high') highestSeverity = 'critical';
        }
      }
    }

    const isCrisis = highestSeverity !== 'none';
    const recommendedAction = this.getRecommendedAction(highestSeverity, confidence);

    return {
      isCrisis,
      severity: highestSeverity,
      detectedKeywords,
      confidence,
      recommendedAction
    };
  }

  private getRecommendedAction(
    severity: 'critical' | 'high' | 'medium' | 'none',
    confidence: number
  ): 'immediate_intervention' | 'show_resources' | 'monitor' {
    if (severity === 'critical' || (severity === 'high' && confidence > 0.8)) {
      return 'immediate_intervention';
    }
    if (severity === 'high' || (severity === 'medium' && confidence > 0.8)) {
      return 'show_resources';
    }
    return 'monitor';
  }

  updateKeywords(newKeywords: Partial<CrisisKeywordConfig>): void {
    if (newKeywords.critical) {
      this.keywords.critical = [...DEFAULT_CRISIS_KEYWORDS.critical, ...newKeywords.critical];
    }
    if (newKeywords.high) {
      this.keywords.high = [...DEFAULT_CRISIS_KEYWORDS.high, ...newKeywords.high];
    }
    if (newKeywords.medium) {
      this.keywords.medium = [...DEFAULT_CRISIS_KEYWORDS.medium, ...newKeywords.medium];
    }
  }

  getKeywords(): CrisisKeywordConfig {
    return { ...this.keywords };
  }
}

// Export singleton instance
export const crisisDetectionService = new CrisisDetectionService();