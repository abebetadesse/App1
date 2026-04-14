// Dynamic CSP setup
const getSecurityPolicy = () => {
  const basePolicy = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", 
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://fonts.gstatic.com",
          "data:"
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net"
        ],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          process.env.API_BASE_URL || "http://localhost:3005",
          "ws://localhost:3005"
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  };

  // Development-specific relaxations
  if (process.env.NODE_ENV !== 'production') {
    basePolicy.contentSecurityPolicy.directives.styleSrc.push("http://localhost:*");
    basePolicy.contentSecurityPolicy.directives.connectSrc.push("http://localhost:*");
    basePolicy.contentSecurityPolicy.directives.connectSrc.push("ws://localhost:*");
    basePolicy.contentSecurityPolicy.reportOnly = true;
  }

  return basePolicy;
};

app.use(helmet(getSecurityPolicy()));