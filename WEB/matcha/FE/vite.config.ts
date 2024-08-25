import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "@svgr/rollup";
import * as path from "path";

// https://vitejs.dev/config/

// export default defineConfig({
//   plugins: [react(), svgr()],
//   resolve: {
//     alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//         configure: (proxy, _options) => {
//           proxy.on("proxyReq", (proxyReq, req, res) => {
//             // proxyReq.setHeader("Connection", "keep-alive");
//             proxyReq.setHeader("Content-Length", "Infinity");
//           });
//           proxy.on("proxyRes", (proxyRes, req, res) => {
//             // proxyRes.headers["connection"] = "keep-alive";
//             proxyRes.headers["content-length"] = "Infinity";
//           });
//         },
//       },
//     },
//   },
// });

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    host: '0.0.0.0',  // 이 줄을 추가
    proxy: {
      "/api": {
        target: "http://web:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      '/socket.io': {
        target: 'http://web:3001',
        ws: true,
      },
    },
  },
});
