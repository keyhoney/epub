import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: [
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/extension-image',
    '@tiptap/extension-link',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-text-align',
    '@tiptap/extension-underline',
    '@tiptap/extension-text-style',
    '@tiptap/extension-color',
    '@tiptap/extension-highlight',
    '@tiptap/extension-subscript',
    '@tiptap/extension-superscript',
    '@tiptap/extension-table',
    '@tiptap/extension-table-row',
    '@tiptap/extension-table-header',
    '@tiptap/extension-table-cell',
    '@tiptap/extension-character-count',
    '@tiptap/extension-code-block-lowlight',
    'lowlight',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
  ],
  webpack: (config, {dev}) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    return config;
  },
};

export default nextConfig;
