const allowedOrigins = [
  "http://localhost:3300",
  "http://localhost:3000",
  "https://cloryto-33cb8.web.app",
];

export const corsOption = {
  origin: function (origin: any, callback: any) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not ' +
                'allow access from the specified Origin. -${origin}`;
      callback(new Error(msg), false);
      return;
    }
    callback(null, true);
    return;
  },

  exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  credentials: true,
};
