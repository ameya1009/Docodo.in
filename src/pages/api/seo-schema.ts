import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    businessName,
    category = 'LocalBusiness',
    address = 'Pune, Maharashtra',
    phone = '+91 99999 99999',
    url = 'https://docodo.in',
    openingHours = 'Mo-Su 10:00-21:00',
    services = ''
  } = req.body;

  if (!businessName) {
    return res.status(400).json({ error: 'Business name is required' });
  }

  const parsedServices = typeof services === 'string'
    ? services.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(services) ? services : [];

  // Generate structured JSON-LD
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': category,
    'name': businessName,
    'image': 'https://docodo.in/logo.jpg',
    '@id': `${url}#localbusiness`,
    'url': url,
    'telephone': phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': address,
      'addressLocality': 'Pune',
      'addressRegion': 'MH',
      'postalCode': address.match(/\b\d{6}\b/)?.[0] || '411045',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 18.5590, // Approx latitude for Pune West (Baner/Balewadi)
      'longitude': 73.7797 // Approx longitude
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        'opens': openingHours.split(' ')[1]?.split('-')[0] || '10:00',
        'closes': openingHours.split(' ')[1]?.split('-')[1] || '21:00'
      }
    ]
  };

  if (parsedServices.length > 0) {
    schema['hasOfferCatalog'] = {
      '@type': 'OfferCatalog',
      'name': `${businessName} Services`,
      'itemListElement': parsedServices.map((service: string, index: number) => ({
        '@type': 'OfferCatalog',
        'name': service,
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': service,
              'description': `Professional ${service} service provided by ${businessName} in Pune.`
            }
          }
        ]
      }))
    };
  }

  // Also include software application if Docodo powered
  const wrapper = {
    '@context': 'https://schema.org',
    '@graph': [
      schema,
      {
        '@type': 'SoftwareApplication',
        'name': 'Docodo AI Growth OS',
        'operatingSystem': 'All',
        'applicationCategory': 'BusinessApplication',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '75'
        },
        'offers': {
          '@type': 'Offer',
          'price': '4999.00',
          'priceCurrency': 'INR'
        }
      }
    ]
  };

  return res.status(200).json({ schema: JSON.stringify(wrapper, null, 2) });
}
