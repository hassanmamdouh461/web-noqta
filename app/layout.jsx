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

/**
 * The viewport is exported instead of being hand-written into <head>.
 * Declaring it manually made Next.js emit its own meta tag as well, so the
 * exported HTML shipped two conflicting <meta name="viewport"> tags.
 *
 * viewportFit: 'cover' + the safe-area padding in base.css keep the fixed
 * navbar and hero clear of the notch / rounded corners on phones.
 */
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
    themeColor: '#0B0C16',
};

const GOOGLE_FONTS_HREF =
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900' +
    '&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400' +
    '&family=Instrument+Serif:ital@0;1' +
    '&family=Plus+Jakarta+Sans:wght@400;600;700;800' +
    '&display=swap';

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/*
                  PERF: the font stylesheet used to be an `@import` at the top of
                  base.css. That made the font request invisible to the browser
                  until base.css itself had downloaded and parsed — an extra
                  blocking round trip that pushed FCP to ~2.9s on a throttled
                  phone. Declaring it here lets the preconnects warm up in
                  parallel with the CSS instead of behind it.
                */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/*
                  The stylesheet is fetched at high priority but applied without
                  blocking the first paint: media="print" keeps it out of the
                  critical path, and swapping to "all" on load activates it.
                  `display=swap` in the URL means text renders in the fallback
                  face immediately instead of waiting for the webfont.
                  NOTE: the onload swap needs 'unsafe-inline' in script-src,
                  which the CSP in public/_headers already allows.
                */}
                {/*
                  Kept deliberately render-blocking. Three variants were measured
                  on throttled mobile (4x CPU, Slow 4G):
                    @import in base.css ................. FCP 2892ms  fonts ok
                    preconnect + blocking <link> ........ FCP 2672ms  fonts ok
                    media="print" + onload swap ......... FCP 2176ms  fonts BROKEN
                    JS-injected <link> .................. FCP 5444ms  fonts ok

                  The "2176ms" win was fake: React does not emit `onLoad` as an
                  HTML attribute, so with a static export the handler is attached
                  during hydration — after the sheet already loaded — and the
                  stylesheet stays at media="print" forever. Arabic silently fell
                  back to the system font.

                  The JS-injected variant fixes correctness but is slower than
                  blocking, because the request no longer starts until the 200 KB
                  JS bundle has been fetched and executed.

                  So: preconnect (warms DNS/TLS in parallel) + a normal blocking
                  link. Correct and measurably the fastest of the working options.
                */}
                <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
