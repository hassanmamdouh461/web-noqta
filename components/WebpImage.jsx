/**
 * Raster image with a WebP source and the original file as a fallback.
 *
 * The slide artwork under `public/assets/noqta/` shipped as unoptimised PNGs
 * (3.23 MB across five files). Every one of them now has a `.webp` sibling
 * (~95% smaller) generated with sharp; this component requests that variant
 * first while keeping the PNG for any browser that cannot decode WebP.
 *
 * IMPORTANT: `picture` is set to `display: contents` in app/styles/base.css so
 * this wrapper is layout-transparent — the <img> stays the direct flex/grid
 * child of its parent, which is what every surrounding CSS rule expects.
 */
export default function WebpImage({ src, alt = '', className, ...rest }) {
    const webp = src.replace(/\.(png|jpe?g)$/i, '.webp');

    return (
        <picture>
            <source srcSet={webp} type="image/webp" />
            <img src={src} alt={alt} className={className} {...rest} />
        </picture>
    );
}
