import { serve } from "bun";
import index from "./index.html";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, target',
};

const server = serve({
  routes: {
    "/api/tags": {
      async GET(req) {
        const response = await fetch(req.headers.get('target')!, {
          headers: req.headers,
        });
        
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
          headers: corsHeaders,
        });
      },
    },

    "/api/chat": {
      async POST(req) {
        const response = await fetch(req.headers.get('target')!, {
          method: 'POST',
          headers: req.headers,
          body: req.body,
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
          headers: corsHeaders,
        });
      },
    },

    // Serve index.html for all unmatched routes (must be last).
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);