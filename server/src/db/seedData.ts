import { BusinessModel, BusinessStage, BusinessStatus, BusinessType, CompanySize, DataCompleteness, EmailDepartment, EmailType, EmailValidationStatus, Lead, LocationType, ScoreTier, SourceType, WebsitePlatform } from '../types';
import { LeadScoringService } from '../services/leadScoringService';
import { v4 as uuidv4 } from 'uuid';

export const NICHES = [
  { niche: 'Digital Marketing', industry: 'Marketing & Advertising', category: 'Digital Agency', subcategory: 'Performance Marketing' },
  { niche: 'Web Design', industry: 'Information Technology', category: 'Creative Studio', subcategory: 'UI/UX Design' },
  { niche: 'Graphic Design', industry: 'Design & Media', category: 'Branding Agency', subcategory: 'Visual Identity' },
  { niche: 'SEO Agency', industry: 'Search Marketing', category: 'Search Engine Optimization', subcategory: 'Technical SEO' },
  { niche: 'E-commerce', industry: 'Retail & Commerce', category: 'Online Store', subcategory: 'Direct-to-Consumer' },
  { niche: 'Real Estate', industry: 'Property & Real Estate', category: 'Real Estate Brokerage', subcategory: 'Commercial & Residential' },
  { niche: 'Restaurant', industry: 'Hospitality & Food', category: 'Dining & Bistro', subcategory: 'Fine Dining' },
  { niche: 'Hotel', industry: 'Hospitality & Travel', category: 'Boutique Hotel', subcategory: 'Resort & Suites' },
  { niche: 'Travel Agency', industry: 'Tourism & Travel', category: 'Tour Operator', subcategory: 'Corporate Travel' },
  { niche: 'Software Company', industry: 'Technology', category: 'Enterprise Software', subcategory: 'Cloud Engineering' },
  { niche: 'SaaS', industry: 'Cloud & B2B Tech', category: 'Productivity Software', subcategory: 'Subscription Platform' },
  { niche: 'Consulting', industry: 'Professional Services', category: 'Management Consulting', subcategory: 'Strategy & Growth' },
  { niche: 'Education', industry: 'Education & EdTech', category: 'Training Institute', subcategory: 'E-Learning' },
  { niche: 'Healthcare', industry: 'Medical & Healthcare', category: 'Medical Clinic', subcategory: 'Specialized Care' },
  { niche: 'Construction', industry: 'Building & Infrastructure', category: 'General Contracting', subcategory: 'Commercial Build' },
  { niche: 'Photography', industry: 'Creative Arts', category: 'Commercial Photography', subcategory: 'Product & Fashion' },
  { niche: 'Law Firm', industry: 'Legal Services', category: 'Legal Practice', subcategory: 'Corporate & IP Law' },
  { niche: 'Accounting', industry: 'Financial Services', category: 'CPA & Audit Firm', subcategory: 'Tax & Advisory' },
  { niche: 'Manufacturing', industry: 'Industrial & Manufacturing', category: 'Equipment Fabrication', subcategory: 'Precision Engineering' },
];

export const LOCATIONS = [
  { country: 'USA', state: 'New York', city: 'New York City', district: 'Manhattan', area: 'SoHo', zip: '10012', lang: 'English' },
  { country: 'USA', state: 'California', city: 'Los Angeles', district: 'Westside', area: 'Santa Monica', zip: '90401', lang: 'English' },
  { country: 'USA', state: 'Illinois', city: 'Chicago', district: 'Cook County', area: 'The Loop', zip: '60601', lang: 'English' },
  { country: 'USA', state: 'Texas', city: 'Austin', district: 'Travis County', area: 'Downtown', zip: '78701', lang: 'English' },
  { country: 'USA', state: 'Florida', city: 'Miami', district: 'Miami-Dade', area: 'Brickell', zip: '33131', lang: 'English' },
  { country: 'UK', state: 'Greater London', city: 'London', district: 'City of London', area: 'Shoreditch', zip: 'EC2A 4NE', lang: 'English' },
  { country: 'UK', state: 'Greater Manchester', city: 'Manchester', district: 'Northern Quarter', area: 'Piccadilly', zip: 'M1 1AD', lang: 'English' },
  { country: 'Canada', state: 'Ontario', city: 'Toronto', district: 'Downtown Core', area: 'King West', zip: 'M5V 2H1', lang: 'English' },
  { country: 'Canada', state: 'British Columbia', city: 'Vancouver', district: 'Gastown', area: 'Yaletown', zip: 'V6B 1A1', lang: 'English' },
  { country: 'Australia', state: 'New South Wales', city: 'Sydney', district: 'CBD', area: 'Surry Hills', zip: '2010', lang: 'English' },
  { country: 'Australia', state: 'Victoria', city: 'Melbourne', district: 'Inner City', area: 'Fitzroy', zip: '3065', lang: 'English' },
  { country: 'Germany', state: 'Berlin', city: 'Berlin', district: 'Mitte', area: 'Kreuzberg', zip: '10115', lang: 'German' },
  { country: 'Germany', state: 'Bavaria', city: 'Munich', district: 'Maxvorstadt', area: 'Schwabing', zip: '80333', lang: 'German' },
  { country: 'France', state: 'Île-de-France', city: 'Paris', district: '8th Arrondissement', area: 'Opéra', zip: '75008', lang: 'French' },
  { country: 'UAE', state: 'Dubai', city: 'Dubai', district: 'Business Bay', area: 'DIFC', zip: '00000', lang: 'Arabic' },
  { country: 'Saudi Arabia', state: 'Riyadh Province', city: 'Riyadh', district: 'Al Olaya', area: 'King Fahd Rd', zip: '12213', lang: 'Arabic' },
  { country: 'Bangladesh', state: 'Dhaka Division', city: 'Dhaka', district: 'Gulshan', area: 'Banani', zip: '1213', lang: 'Bangla' },
  { country: 'Bangladesh', state: 'Chittagong Division', city: 'Chittagong', district: 'Agrabad', area: 'GEC Circle', zip: '4000', lang: 'Bangla' },
  { country: 'India', state: 'Karnataka', city: 'Bangalore', district: 'Urban', area: 'Indiranagar', zip: '560038', lang: 'English' },
  { country: 'India', state: 'Maharashtra', city: 'Mumbai', district: 'Bandra', area: 'BKC', zip: '400051', lang: 'Hindi' },
  { country: 'Pakistan', state: 'Sindh', city: 'Karachi', district: 'Clifton', area: 'DHA Phase 5', zip: '75500', lang: 'Urdu' },
  { country: 'Singapore', state: 'Central', city: 'Singapore', district: 'Marina Bay', area: 'Raffles Place', zip: '018981', lang: 'English' },
];

const B_TYPES: BusinessType[] = ['Agency', 'Company', 'Freelancer', 'Store', 'Organization'];
const SIZES: CompanySize[] = ['Solo', 'Freelancer', '1-10', '11-50', '51-200', '201-500', '500+', 'Unknown'];
const PLATFORMS: WebsitePlatform[] = ['WordPress', 'Shopify', 'Wix', 'Squarespace', 'Webflow', 'Custom Website'];
const EMAIL_DEPTS: EmailDepartment[] = ['General', 'Info', 'Contact', 'Sales', 'Marketing', 'Support', 'Management'];

export function generateSeedLeads(): Lead[] {
  const leads: Lead[] = [];
  let index = 1;

  for (let nIdx = 0; nIdx < NICHES.length; nIdx++) {
    const nicheObj = NICHES[nIdx];
    for (let lIdx = 0; lIdx < LOCATIONS.length; lIdx++) {
      const loc = LOCATIONS[lIdx];

      const cleanBizName = `${loc.city} ${nicheObj.niche.split(' ')[0]} ${
        index % 5 === 0 ? 'Studio' : index % 3 === 0 ? 'Solutions' : index % 2 === 0 ? 'Partners' : 'Group'
      }`;

      const domainSlug = cleanBizName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const hasWebsite = index % 12 !== 0; // 92% have websites
      const tld = loc.country === 'USA' ? 'com' : loc.country === 'UK' ? 'co.uk' : loc.country === 'Canada' ? 'ca' : loc.country === 'Australia' ? 'com.au' : loc.country === 'Germany' ? 'de' : loc.country === 'France' ? 'fr' : loc.country === 'Bangladesh' ? 'com.bd' : 'com';
      const website = hasWebsite ? `https://www.${domainSlug}.${tld}` : '';

      const hasEmail = index % 10 !== 0; // 90% have emails
      let emailType: EmailType = 'Business Domain';
      let publicEmail = '';
      const dept = EMAIL_DEPTS[index % EMAIL_DEPTS.length];
      const deptPrefix = dept.toLowerCase();

      if (hasEmail) {
        if (index % 7 === 0) {
          emailType = 'Public Business Gmail';
          publicEmail = `${domainSlug}.${deptPrefix}@gmail.com`;
        } else if (index % 15 === 0) {
          emailType = 'Public Business Outlook';
          publicEmail = `${domainSlug}@outlook.com`;
        } else if (index % 25 === 0) {
          emailType = 'Public Business Yahoo';
          publicEmail = `${domainSlug}@yahoo.com`;
        } else {
          emailType = 'Business Domain';
          publicEmail = `${deptPrefix}@${domainSlug}.${tld}`;
        }
      }

      // Email validation simulation
      let emailStatus: EmailValidationStatus = 'Valid';
      let isDisposable = false;
      let isRole = false;
      let domainValid = hasWebsite;
      let mxAvailable = true;

      if (!hasEmail) {
        emailStatus = 'Unknown';
        domainValid = false;
        mxAvailable = false;
      } else if (index % 17 === 0) {
        emailStatus = 'Risky';
        isRole = true;
      } else if (index % 23 === 0) {
        emailStatus = 'Invalid';
        mxAvailable = false;
      } else {
        emailStatus = 'Valid';
        domainValid = true;
        mxAvailable = true;
      }

      const platform = PLATFORMS[index % PLATFORMS.length];
      const bType = B_TYPES[index % B_TYPES.length];
      const cSize = SIZES[index % SIZES.length];
      const bModel: BusinessModel = index % 3 === 0 ? 'B2C' : 'B2B';
      const bStage: BusinessStage = index % 4 === 0 ? 'Startup' : 'Established';
      const locType: LocationType = index % 5 === 0 ? 'Online' : 'Local';

      const phone = `+${loc.country === 'USA' ? '1' : loc.country === 'UK' ? '44' : loc.country === 'Bangladesh' ? '880' : loc.country === 'India' ? '91' : '1'} (555) ${100 + (index % 900)}-${1000 + (index % 9000)}`;

      const daysAgo = (index * 3) % 180;
      const firstDiscovered = new Date(Date.now() - daysAgo * 86400000).toISOString();
      const lastChecked = new Date(Date.now() - (daysAgo % 14) * 86400000).toISOString();

      let completeness: DataCompleteness = 'Complete Lead';
      if (!hasWebsite && hasEmail) completeness = 'Email Only';
      else if (hasWebsite && !hasEmail) completeness = 'Website Only';
      else if (!hasWebsite && !hasEmail) completeness = 'Partial Lead';

      const draftLead: Partial<Lead> = {
        businessName: cleanBizName,
        niche: nicheObj.niche,
        industry: nicheObj.industry,
        category: nicheObj.category,
        subcategory: nicheObj.subcategory,
        businessType: bType,
        serviceType: 'Consulting & Implementation',
        productType: 'Professional Services',
        companySize: cSize,
        businessModel: bModel,
        businessStage: bStage,
        locationType: locType,
        country: loc.country,
        state: loc.state,
        city: loc.city,
        district: loc.district,
        area: loc.area,
        zipCode: loc.zip,
        address: `${100 + index} Commerce Avenue, ${loc.area}`,
        serviceArea: `Metro ${loc.city} & Regional`,
        website,
        hasWebsite,
        httpsAvailable: hasWebsite,
        customDomain: hasWebsite && !website.includes('wordpress.com'),
        websitePlatform: platform,
        websiteStatus: 'Active',
        websiteLanguage: loc.lang,
        publicEmail,
        hasEmail,
        emailType,
        emailDepartment: dept,
        emailStatus,
        isDisposableEmail: isDisposable,
        isRoleBasedEmail: isRole,
        domainValid,
        mxAvailable,
        phone,
        hasPhone: true,
        hasContactForm: hasWebsite,
        businessStatus: 'Active',
        socialProfiles: {
          linkedin: `https://linkedin.com/company/${domainSlug}`,
          facebook: `https://facebook.com/${domainSlug}`,
          twitter: `https://x.com/${domainSlug}`,
        },
        hasSocialProfile: true,
        sourceUrl: hasWebsite ? website : `https://publicdirectory.org/biz/${domainSlug}`,
        sourceType: hasWebsite ? 'Business Website' : 'Public Business Directory',
        firstDiscovered,
        lastChecked,
        isDuplicate: false,
        dataCompleteness: completeness,
        tags: [nicheObj.niche.toLowerCase(), loc.country.toLowerCase(), 'public-lead'],
        notes: `Synthetic demo record created for public business directory testing. Discovered via public listing.`,
        isSaved: index % 6 === 0,
      };

      const scoreBreakdown = LeadScoringService.calculateScore(draftLead);

      const lead: Lead = {
        id: uuidv4(),
        ...draftLead as any,
        leadScore: scoreBreakdown.totalScore,
        scoreTier: scoreBreakdown.tier,
        scoreBreakdown,
        createdAt: firstDiscovered,
        updatedAt: lastChecked,
      };

      leads.push(lead);
      index++;
    }
  }

  // Inject a few deliberate duplicates to test duplicate filters & deduplication
  if (leads.length > 10) {
    const dup1 = {
      ...leads[2],
      id: uuidv4(),
      businessName: `${leads[2].businessName} LLC`,
      sourceUrl: `https://secondary-public-directory.com/listing/${leads[2].id}`,
      sourceType: 'Public Business Profile' as SourceType,
      isDuplicate: true,
      canonicalLeadId: leads[2].id,
      notes: 'Duplicate record discovered from secondary public registry.',
    };
    const dup2 = {
      ...leads[7],
      id: uuidv4(),
      businessName: `${leads[7].businessName} Corp.`,
      sourceUrl: `https://yellowpages-public.com/entry/${leads[7].id}`,
      sourceType: 'Public Business Directory' as SourceType,
      isDuplicate: true,
      canonicalLeadId: leads[7].id,
      notes: 'Duplicate listing verified.',
    };
    leads.push(dup1, dup2);
  }

  return leads;
}
