export const SITE_CONFIG = {
  name: 'Yuva Kranti Dal',
  hindiName: 'युवा क्रांति दल',
  shortName: 'YKD',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yuvakrantidal.org',
  tagline: 'Empowering Youth, Transforming Society, Nation First',
  description: 'Yuva Kranti Dal (युवा क्रांति दल) is a government-registered 12A & 80G certified NGO in India. We mobilize youth for underprivileged child education, 24/7 emergency blood donation, women skill training, and rapid humanitarian relief.',
  phone: '+91 93196 98759',
  email: 'ravisain75688@gmail.com',
  address: {
    streetAddress: 'Krishna Vihar, Pala Road',
    addressLocality: 'Aligarh',
    addressRegion: 'Uttar Pradesh',
    postalCode: '202001',
    addressCountry: 'IN',
  },
  registrationNo: 'REG/2021/NGO/DEL/8741',
  nitiAayogDarpanId: 'RJ/2022/0319482',
  csrNumber: 'CSR00049281',
  panNumber: 'AAATB4321Q',
  taxExemption12A: 'CIT(EXEMP)/12A/2021-22/A-492',
  taxExemption80G: 'CIT(EXEMP)/80G/2021-22/G-881',
};

export const defaultOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: SITE_CONFIG.name,
  alternateName: [SITE_CONFIG.hindiName, SITE_CONFIG.shortName, 'Yuva Kranti Dal NGO'],
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.jpeg`,
  image: `${SITE_CONFIG.url}/logo.jpeg`,
  description: SITE_CONFIG.description,
  taxID: `${SITE_CONFIG.taxExemption80G} | ${SITE_CONFIG.taxExemption12A}`,
  foundingDate: '2021',
  nonprofitStatus: 'Nonprofit501c3',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.address.streetAddress,
    addressLocality: SITE_CONFIG.address.addressLocality,
    addressRegion: SITE_CONFIG.address.addressRegion,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.addressCountry,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'Helpline & Member Inquiries',
      email: SITE_CONFIG.email,
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
    {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'Emergency Blood Support',
      areaServed: 'IN',
      availableLanguage: ['Hindi', 'English'],
    },
  ],
  sameAs: [
    'https://facebook.com',
    'https://instagram.com',
    'https://twitter.com',
    'https://linkedin.com',
  ],
  knowsAbout: [
    'Youth Empowerment in India',
    'Underprivileged Children Free Education',
    'Emergency Voluntary Blood Donation',
    'Women Livelihood & Skill Development',
    'Section 80G Tax Deductible NGO Donation',
    'Grassroots Community Welfare Programs',
  ],
};

export const defaultWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Yuva Kranti Dal',
  alternateName: 'युवा क्रांति दल',
  url: SITE_CONFIG.url,
  inLanguage: ['en-IN', 'hi-IN'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_CONFIG.url}/campaigns?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
}

export function generateFaqSchema(faqList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
