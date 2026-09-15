import './globals.css';

export const metadata = {
    title: 'نقطة | Noqta — Software & Creative Media Collective',
    description: 'نقطة تيم يجمع بين القوة البرمجية (Software & Tech) والإبداع التسويقي (Media & Marketing). نصنع كود يعيش وهوية تعلق في البال.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="ltr">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;1,9..40,400&family=Epilogue:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    );
}
