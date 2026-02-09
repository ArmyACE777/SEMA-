module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://victorious-animal-46b1eb6b21.strapiapp.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://victorious-animal-46b1eb6b21.strapiapp.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        // Production
        'https://sema-iaipi.vercel.app',
        
        // Vercel preview deployments
        'https://sema-iaipi-git-*.vercel.app',
        /^https:\/\/sema-iaipi-[a-z0-9]+-[a-z0-9]+\.vercel\.app$/,
        
        // Local development
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:1337',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
