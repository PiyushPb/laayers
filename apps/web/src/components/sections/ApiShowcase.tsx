"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const endpoints = {
  "/v1/cache/products": {
    headers: ["X-Laayers-TTL: 60", "X-Laayers-TTL: 300"],
    params: ["include_reviews=true", "include_reviews=false"],
    responses: {
      "X-Laayers-TTL: 60": {
        "include_reviews=true": {
          status: 200,
          latency: "1.4ms",
          cache: "HIT",
          body: {
            cache_key: "products:reviews:true",
            ttl_remaining: 58,
            items: [
              { id: 1, name: "Laayers Pro", price: 99, reviews: [{ rating: 5, author: "piyush" }] },
            ],
          },
        },
        "include_reviews=false": {
          status: 200,
          latency: "1.2ms",
          cache: "HIT",
          body: {
            cache_key: "products:reviews:false",
            ttl_remaining: 59,
            items: [{ id: 1, name: "Laayers Pro", price: 99 }],
          },
        },
      },
      "X-Laayers-TTL: 300": {
        "include_reviews=true": {
          status: 200,
          latency: "1.5ms",
          cache: "HIT",
          body: {
            cache_key: "products:reviews:true",
            ttl_remaining: 298,
            items: [
              { id: 1, name: "Laayers Pro", price: 99, reviews: [{ rating: 5, author: "piyush" }] },
            ],
          },
        },
        "include_reviews=false": {
          status: 200,
          latency: "1.3ms",
          cache: "HIT",
          body: {
            cache_key: "products:reviews:false",
            ttl_remaining: 299,
            items: [{ id: 1, name: "Laayers Pro", price: 99 }],
          },
        },
      },
    },
  },
  "/v1/cache/purge": {
    headers: ["X-Laayers-Zone: Tokyo", "X-Laayers-Zone: Global"],
    params: ["pattern=*", "pattern=products:*"],
    responses: {
      "X-Laayers-Zone: Tokyo": {
        "pattern=*": {
          status: 200,
          latency: "4.8ms",
          cache: "PURGE_SUCCESS",
          body: {
            purged_keys: 1824,
            scope: "Tokyo Edge",
            propagate: false,
          },
        },
        "pattern=products:*": {
          status: 200,
          latency: "3.2ms",
          cache: "PURGE_SUCCESS",
          body: {
            purged_keys: 12,
            scope: "Tokyo Edge",
            propagate: false,
          },
        },
      },
      "X-Laayers-Zone: Global": {
        "pattern=*": {
          status: 200,
          latency: "24ms",
          cache: "PURGE_SUCCESS",
          body: {
            purged_keys: 1824,
            scope: "Global Mesh",
            propagate: true,
          },
        },
        "pattern=products:*": {
          status: 200,
          latency: "18ms",
          cache: "PURGE_SUCCESS",
          body: {
            purged_keys: 12,
            scope: "Global Mesh",
            propagate: true,
          },
        },
      },
    },
  },
};

export default function ApiShowcase() {
  const [endpoint, setEndpoint] = useState<"/v1/cache/products" | "/v1/cache/purge">("/v1/cache/products");
  const [header, setHeader] = useState("X-Laayers-TTL: 60");
  const [param, setParam] = useState("include_reviews=true");

  // Safeguard state switching when swapping endpoints
  const endpointConfig = endpoints[endpoint];
  const currentHeader = endpointConfig.headers.includes(header) ? header : endpointConfig.headers[0];
  const currentParam = endpointConfig.params.includes(param) ? param : endpointConfig.params[0];

  // Get active response
  // @ts-ignore
  const responseData = endpointConfig.responses[currentHeader]?.[currentParam] || {
    status: 400,
    latency: "0ms",
    cache: "MISS",
    body: { error: "Invalid parameters" },
  };

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            API Showcase
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Interactive Playgrounds
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
            Tune headers and parameters live to verify response speed and caching status codes at the routing gateway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Settings panel */}
          <div className="lg:col-span-5 bg-zinc-950/40 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {/* Endpoint selection */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Endpoint path
                </span>
                <select
                  value={endpoint}
                  onChange={(e) => {
                    const nextVal = e.target.value as keyof typeof endpoints;
                    setEndpoint(nextVal);
                    // Reset defaults for clean select sync
                    setHeader(endpoints[nextVal].headers[0]);
                    setParam(endpoints[nextVal].params[0]);
                  }}
                  className="bg-black border border-white/10 text-white font-mono text-xs p-3 rounded-sm focus:outline-none focus:border-white/30"
                >
                  <option value="/v1/cache/products">GET /v1/cache/products</option>
                  <option value="/v1/cache/purge">POST /v1/cache/purge</option>
                </select>
              </div>

              {/* Header selection */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Request Header
                </span>
                <div className="flex flex-col gap-2">
                  {endpointConfig.headers.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHeader(h)}
                      className={`text-left font-mono text-xs p-3 border rounded-sm transition-colors focus:outline-none ${
                        currentHeader === h
                          ? "border-white/20 bg-zinc-900/60 text-white"
                          : "border-white/5 bg-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Params selection */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Query Parameters
                </span>
                <div className="flex flex-col gap-2">
                  {endpointConfig.params.map((p) => (
                    <button
                      key={p}
                      onClick={() => setParam(p)}
                      className={`text-left font-mono text-xs p-3 border rounded-sm transition-colors focus:outline-none ${
                        currentParam === p
                          ? "border-white/20 bg-zinc-900/60 text-white"
                          : "border-white/5 bg-transparent text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      ?{p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wide mt-8 border-t border-white/5 pt-4">
              Endpoint latency is automatically updated
            </div>
          </div>

          {/* Response panel */}
          <div className="lg:col-span-7 bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                HTTP Response payload
              </span>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="text-zinc-500">
                  Status: <span className="text-white">{responseData.status} OK</span>
                </span>
                <span className="text-zinc-500">
                  Latency: <span className="text-white">{responseData.latency}</span>
                </span>
                <span className="text-zinc-500">
                  Cache: <span className="text-white">{responseData.cache}</span>
                </span>
              </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-sm p-4 font-mono text-xs md:text-sm text-zinc-400 overflow-x-auto min-h-[220px]">
              <pre className="whitespace-pre">
                {JSON.stringify(responseData.body, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
