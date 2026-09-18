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

/**
 * Faces used by above-the-fold Arabic text, preloaded so the hero headline
 * paints in Cairo rather than swapping in from the fallback.
 *
 * The list is generated (lib/font-preload.js) by
 * .workbuddy-ai/tools/selfhost-fonts.mjs — never hand-write these paths. The
 * filenames embed Google's content hash, and a hand-copied one already shipped
 * as a 404 preload once.
 */
import { PRELOAD_FONTS } from '@/lib/font-preload';

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/*
                  Fonts are self-hosted (app/styles/fonts.css), not pulled from
                  fonts.googleapis.com.

                  History, so this is not re-litigated. The font stylesheet was
                  first an @import in base.css (FCP 2892ms), then a blocking
                  link to Google (FCP 2672ms) — both paid a render-blocking
                  round trip to a third-party origin. A media="print" + onload
                  swap looked like a win at 2176ms but was fake: React does not
                  emit onLoad as an HTML attribute, so with output: 'export' the
                  handler attaches during hydration — after the sheet loaded —
                  leaving it at media="print" forever with Arabic silently
                  falling back to the system font. A JS-injected link was
                  correct but regressed FCP to 5444ms.

                  Self-hosting removes the third-party hop entirely: the
                  @font-face rules are inlined into our own CSS bundle and the
                  two critical faces below are preloaded. The unicode-range
                  subsets are preserved, so a browser still only downloads the
                  Arabic vs Latin faces it actually renders.
                */}
                {PRELOAD_FONTS.map((href) => (
                    <link
                        key={href}
                        rel="preload"
                        href={href}
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                ))}
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
