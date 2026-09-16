import { Lead, ScoreBreakdown, ScoreItem, ScoreTier } from '../types';

export class LeadScoringService {
  /**
   * Calculates a transparent, explainable lead score from 0 to 100 based on public business signals.
   * Never uses private, hidden, or discriminatory personal attributes.
   */
  public static calculateScore(lead: Partial<Lead>): ScoreBreakdown {
    const factors: ScoreItem[] = [];

    // 1. Business Website Found & Active (+15 pts)
    const hasActiveWebsite = Boolean(lead.hasWebsite && lead.website && lead.website.trim().length > 0);
    factors.push({
      name: 'Verified Business Website',
      points: hasActiveWebsite ? 15 : 0,
      maxPoints: 15,
      passed: hasActiveWebsite,
      explanation: hasActiveWebsite
        ? `Active public website discovered (${lead.website}) with HTTPS encryption.`
        : 'No public business website listed.',
    });

    // 2. Public Business Email Availability (+25 pts)
    const hasEmail = Boolean(lead.hasEmail && lead.publicEmail && lead.publicEmail.trim().length > 0);
    const isDomainEmail = lead.emailType === 'Business Domain';
    let emailPoints = 0;
    if (hasEmail) {
      emailPoints = isDomainEmail ? 25 : 18; // Corporate domain gets full points, public provider gets 18
    }
    factors.push({
      name: 'Public Business Contact Email',
      points: emailPoints,
      maxPoints: 25,
      passed: hasEmail,
      explanation: hasEmail
        ? `Legitimately published business email (${lead.publicEmail}) classified as ${lead.emailType || 'Standard'}.`
        : 'No publicly listed business contact email identified.',
    });

    // 3. Domain & Mail-Server (MX/DNS) Verification Signals (+20 pts)
    const mxValid = Boolean(lead.mxAvailable && lead.domainValid && lead.emailStatus === 'Valid');
    const isRisky = lead.emailStatus === 'Risky';
    const isDisposable = Boolean(lead.isDisposableEmail);
    let mxPoints = 0;
    if (mxValid) {
      mxPoints = 20;
    } else if (isRisky) {
      mxPoints = 8;
    } else if (isDisposable) {
      mxPoints = -15; // penalty for disposable temporary addresses
    }

    factors.push({
      name: 'Mail Server & DNS Technical Signals',
      points: Math.max(0, mxPoints),
      maxPoints: 20,
      passed: mxValid,
      explanation: mxValid
        ? 'Domain DNS records resolved with active, reachable Mail Exchange (MX) servers.'
        : isDisposable
        ? 'Warning: Temporary or disposable email domain detected.'
        : lead.emailStatus === 'Invalid'
        ? 'DNS/MX resolution failed or host rejects mail transport.'
        : 'Domain validation status is unconfirmed or unknown.',
    });

    // 4. Category & Niche Relevance (+15 pts)
    const categoryMatched = Boolean(lead.niche && lead.category);
    factors.push({
      name: 'Business Category & Niche Match',
      points: categoryMatched ? 15 : 5,
      maxPoints: 15,
      passed: categoryMatched,
      explanation: categoryMatched
        ? `Categorized accurately under "${lead.category}" within the "${lead.niche}" industry.`
        : 'Partial or unverified industry classification.',
    });

    // 5. Public Physical Location / Address Verification (+10 pts)
    const locationVerified = Boolean(lead.country && lead.city);
    factors.push({
      name: 'Verifiable Business Location',
      points: locationVerified ? 10 : 0,
      maxPoints: 10,
      passed: locationVerified,
      explanation: locationVerified
        ? `Geographic location verified in ${lead.city}, ${lead.state ? lead.state + ', ' : ''}${lead.country}.`
        : 'Physical or regional business address unconfirmed.',
    });

    // 6. Source Quality & Public Traceability (+10 pts)
    const hasSource = Boolean(lead.sourceUrl && lead.sourceType);
    factors.push({
      name: 'Source Quality & Audit Traceability',
      points: hasSource ? 10 : 0,
      maxPoints: 10,
      passed: hasSource,
      explanation: hasSource
        ? `Discovered via permitted public channel: ${lead.sourceType} (${lead.sourceUrl}).`
        : 'Missing source attribution reference.',
    });

    // 7. Profile Completeness (Phone, Contact Form, Social Presence) (+5 pts)
    const hasAdditionalContact = Boolean(lead.hasPhone || lead.hasContactForm || lead.hasSocialProfile);
    factors.push({
      name: 'Multi-Channel Business Presence',
      points: hasAdditionalContact ? 5 : 0,
      maxPoints: 5,
      passed: hasAdditionalContact,
      explanation: hasAdditionalContact
        ? `Public multi-channel presence confirmed (${[
            lead.hasPhone ? 'Phone' : null,
            lead.hasContactForm ? 'Contact Form' : null,
            lead.hasSocialProfile ? 'Social Profiles' : null,
          ].filter(Boolean).join(', ')}).`
        : 'No secondary public contact channels discovered.',
    });

    // Calculate total score
    let totalScore = factors.reduce((sum, f) => sum + f.points, 0);
    totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    let tier: ScoreTier = 'Low Quality';
    if (totalScore >= 75) {
      tier = 'High Quality';
    } else if (totalScore >= 45) {
      tier = 'Medium Quality';
    }

    const summary = `${tier} lead (${totalScore}/100) — ${
      totalScore >= 75
        ? 'High probability of responsive business contact with verified domain and public presence.'
        : totalScore >= 45
        ? 'Moderate lead quality with some verified data points; recommend secondary inspection.'
        : 'Low confidence lead; lacks essential business contact or verified digital footprint.'
    }`;

    return {
      totalScore,
      maxScore: 100,
      tier,
      factors,
      summary,
    };
  }
}
