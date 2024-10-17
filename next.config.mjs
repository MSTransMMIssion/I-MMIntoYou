/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/moodle-api/:path*',
                destination: 'https://iut1-mmi-moodle.univ-grenoble-alpes.fr/:path*',
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            }
        ];
    },
};

export default nextConfig;
