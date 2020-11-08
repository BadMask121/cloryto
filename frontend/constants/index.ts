export const ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? 'http://134.122.126.255/events'
    : 'http://localhost:8080/events';
