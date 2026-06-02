import axios from "axios";

// Always same-origin. A RELATIVE baseURL works on localhost, the LAN IP, and in
// production. An absolute URL (e.g. http://localhost:3000) breaks with CORS when
// the app is opened from a different host than the URL points to.
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
