import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/tags": {
      async GET(req) {
        const response = await fetch(req.headers.get('target')!, {
          headers: req.headers,
        });
        
        // Add CORS headers to the response
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      },
      async OPTIONS(req) {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, target',
            'Access-Control-Max-Age': '86400',
          },
        });
      },
    },

    "/api/chat": {
      async POST(req) {
        return fetch(req.headers.get('target')!, {
          method: 'POST',
          headers: req.headers,
          body: req.body})
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
