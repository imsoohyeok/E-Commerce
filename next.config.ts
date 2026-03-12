import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기존에 있던 설정들은 여기에 그대로 둡니다.
  reactStrictMode: true, 
};

export default withBundleAnalyzer(nextConfig);