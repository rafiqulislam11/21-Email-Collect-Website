import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, Sliders, Info, ShieldCheck, Sparkles } from 'lucide-react';

export const LeadScoringPage: React.FC = () => {
  // Simulator state
  const [hasWebsite, setHasWebsite] = useState(true);
  const [hasEmail, setHasEmail] = useState(true);
  const [emailType, setEmailType] = useState<'Business Domain' | 'Public Provider'>('Business Domain');
  const [mxValid, setMxValid] = useState(true);
  const [isDisposable, setIsDisposable] = useState(false);
  const [categoryMatch, setCategoryMatch] = useState(true);
  const [locationVerified, setLocationVerified] = useState(true);
  const [sourceAttribution, setSourceAttribution] = useState(true);
  const [multiChannel, setMultiChannel] = useState(true);

  // Calculate score in simulator
  let totalScore = 0;
  const factors: { name: string; pts: number; max: number; passed: boolean; desc: string }[] = [];

  // 1. Website
  const webPts = hasWebsite ? 15 : 0;
  totalScore += webPts;
  factors.push({
    name: 'Verified Business Website',
    pts: webPts,
    max: 15,
    passed: hasWebsite,
    desc: hasWebsite ? 'Official company domain active and responsive.' : 'No public website found.',
  });

  // 2. Email
  let emailPts = 0;
  if (hasEmail) {
    emailPts = emailType === 'Business Domain' ? 25 : 18;
  }
  totalScore += emailPts;
  factors.push({
    name: 'Public Business Contact Email',
    pts: emailPts,
    max: 25,
    passed: hasEmail,
    desc: hasEmail ? `Published business email (${emailType}).` : 'No publicly published email identified.',
  });

  // 3. DNS/MX
  let mxPts = 0;
  if (mxValid && !isDisposable) mxPts = 20;
  else if (isDisposable) mxPts = 0;
  totalScore += mxPts;
  factors.push({
    name: 'Mail Server & DNS Technical Signals',
    pts: mxPts,
    max: 20,
    passed: mxValid && !isDisposable,
    desc: isDisposable
      ? 'Disposable/temporary domain detected.'
      : mxValid
      ? 'MX and DNS records confirmed reachable.'
      : 'DNS resolution unverified.',
  });

  // 4. Category
  const catPts = categoryMatch ? 15 : 5;
  totalScore += catPts;
  factors.push({
    name: 'Business Category & Niche Match',
    pts: catPts,
    max: 15,
    passed: categoryMatch,
    desc: categoryMatch ? 'Verified primary business niche classification.' : 'Generic or unverified category.',
  });

  // 5. Location
  const locPts = locationVerified ? 10 : 0;
  totalScore += locPts;
  factors.push({
    name: 'Verifiable Business Location',
    pts: locPts,
    max: 10,
    passed: locationVerified,
    desc: locationVerified ? 'Regional address or metro service area verified.' : 'Unconfirmed physical location.',
  });

  // 6. Source Traceability
  const srcPts = sourceAttribution ? 10 : 0;
  totalScore += srcPts;
  factors.push({
    name: 'Source Quality & Traceability',
    pts: srcPts,
    max: 10,
    passed: sourceAttribution,
    desc: sourceAttribution ? 'Permitted public directory listing with timestamp.' : 'Missing source reference.',
  });

  // 7. Multi-Channel
  const multiPts = multiChannel ? 5 : 0;
  totalScore += multiPts;
  factors.push({
    name: 'Multi-Channel Business Presence',
    pts: multiPts,
    max: 5,
    passed: multiChannel,
    desc: multiChannel ? 'Phone or verified social profile available.' : 'Single-channel presence.',
  });

  totalScore = Math.max(0, Math.min(100, totalScore));

  let tier = 'Low Quality';
  if (totalScore >= 75) tier = 'High Quality';
  else if (totalScore >= 45) tier = 'Medium Quality';

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Transparent Lead Quality Scoring</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Open scoring system based purely on technical verification and published business signals.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Simulator Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: 'var(--primary)' }} /> Interactive Score Simulator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Toggle business signals to observe how the scoring algorithm calculates quality tiers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Website Found</span>
              <input type="checkbox" checked={hasWebsite} onChange={(e) => setHasWebsite(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Public Email Listed</span>
              <input type="checkbox" checked={hasEmail} onChange={(e) => setHasEmail(e.target.checked)} />
            </label>

            {hasEmail && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Host Type</span>
                <select
                  className="form-select"
                  style={{ width: '180px', height: '32px', fontSize: '0.8rem' }}
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value as any)}
                >
                  <option value="Business Domain">Business Domain (+25)</option>
                  <option value="Public Provider">Public Gmail/Yahoo (+18)</option>
                </select>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>MX / DNS Signal Confirmed</span>
              <input type="checkbox" checked={mxValid} onChange={(e) => setMxValid(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isDisposable ? 'var(--danger)' : 'inherit' }}>
                Disposable Temporary Domain
              </span>
              <input type="checkbox" checked={isDisposable} onChange={(e) => setIsDisposable(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Category & Niche Match</span>
              <input type="checkbox" checked={categoryMatch} onChange={(e) => setCategoryMatch(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Geographic Location Match</span>
              <input type="checkbox" checked={locationVerified} onChange={(e) => setLocationVerified(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Multi-Channel (Phone / Social)</span>
              <input type="checkbox" checked={multiChannel} onChange={(e) => setMultiChannel(e.target.checked)} />
            </label>
          </div>
        </div>

        {/* Live Score Output */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>CALCULATED SCORE</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalScore}
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
            <span
              className={`badge ${
                tier === 'High Quality' ? 'badge-success' : tier === 'Medium Quality' ? 'badge-warning' : 'badge-danger'
              }`}
              style={{ fontSize: '0.9rem', padding: '6px 16px', marginTop: '10px' }}
            >
              {tier}
            </span>
          </div>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Why this lead received this score:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {factors.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {f.passed ? (
                    <CheckCircle size={15} style={{ color: 'var(--success)' }} />
                  ) : (
                    <XCircle size={15} style={{ color: 'var(--danger)' }} />
                  )}
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{f.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: f.passed ? 'var(--success)' : 'var(--text-muted)' }}>
                  +{f.pts}/{f.max}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)', marginBottom: '4px' }} />
            <div>
              <strong>Compliance Guarantee:</strong> Scoring never considers protected personal attributes, private inbox status, or demographic data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
