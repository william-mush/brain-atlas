import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins to be specified by string (package name)
    // rather than by imported function reference, so options stay serializable.
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [['rehype-slug', {}]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
