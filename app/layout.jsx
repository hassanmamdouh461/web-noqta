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
        {children}
      </body>
    </html>
  );
}
