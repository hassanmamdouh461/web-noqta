import './globals.css';

export const metadata = {
  metadataBase: new URL('https://noqta.engaz.tech'),
  title: 'نقطة | Noqta Creative Solutions — هندسة البرمجيات وصناعة الميديا',
  description: 'وكالة إبداعية وتقنية متكاملة. نجمع بين هندسة البرمجيات وتطبيقات الويب والموبايل والذكاء الاصطناعي، وبين صناعة الهويات البصرية والميديا وحملات التسويق الرقمي.',
  alternates: {
    canonical: 'https://noqta.engaz.tech',
  },
  openGraph: {
    title: 'نقطة | Noqta Creative Solutions',
    description: 'وكالة إبداعية وتقنية متكاملة — هندسة البرمجيات وصناعة الميديا',
    url: 'https://noqta.engaz.tech',
    siteName: 'Noqta Creative Solutions',
    images: [
      {
        url: '/assets/noqta/noqta-logo-square.png',
        width: 1024,
        height: 1024,
        alt: 'Noqta Creative Solutions',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  icons: {
    icon: '/assets/noqta/noqta-icon.svg',
    apple: '/assets/noqta/noqta-icon.svg',
  },
  keywords: [
    'نقطة', 'Noqta', 'Noqta Creative Solutions', 'Software Development',
    'Restaurant POS System', 'AI Business Agents', 'Web Development',
    'Digital Marketing', 'Brand Identity', 'تسويق رقمي', 'برمجة مطاعم', 'هوية بصرية'
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        {/* Instant Brand Splash / Preloader (Visible from 0ms first frame) */}
        <div id="initial-loader" className="initial-loader" aria-hidden="true">
          <div className="initial-loader-inner">
            <svg width="140" height="84" viewBox="0 0 700 420" fill="none" className="initial-loader-icon">
              <circle cx="350" cy="115" r="82.5" fill="currentColor" />
              <path d="M 5 125 H 170 A 180 180 0 0 0 530 125 H 695 A 345 345 0 0 1 5 125 Z" fill="currentColor" />
            </svg>
            <span className="initial-loader-text">نُـقـطَـة</span>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
