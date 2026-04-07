import { defineConfig } from "@pandacss/dev";

const cardShadow = "0 24px 80px rgba(18, 36, 66, 0.12)";
const softShadow = "0 16px 45px rgba(18, 36, 66, 0.1)";

export default defineConfig({
    preflight: true,
    include: ["./index.html", "./js/**/*.js"],
    exclude: [],
    outdir: "styled-system",
    theme: {
        extend: {
            tokens: {
                colors: {
                    brand: {
                        50: { value: "#ecfdf5" },
                        100: { value: "#d1fae5" },
                        500: { value: "#28a27c" },
                        600: { value: "#168564" },
                        700: { value: "#0f6a50" }
                    },
                    ink: {
                        900: { value: "#102033" },
                        700: { value: "#31445d" },
                        500: { value: "#62738a" }
                    },
                    line: {
                        100: { value: "#e9eef5" }
                    }
                }
            }
        }
    },
    globalCss: {
        ":root": {
            "--color-brand-50": "#ecfdf5",
            "--color-brand-100": "#d1fae5",
            "--color-brand-500": "#28a27c",
            "--color-brand-600": "#168564",
            "--color-brand-700": "#0f6a50",
            "--color-ink-900": "#102033",
            "--color-ink-700": "#31445d",
            "--color-ink-500": "#62738a",
            "--color-line-100": "#e9eef5",
            "--color-surface": "#ffffff",
            "--color-warm": "#fff7e6",
            "--max-width": "1120px",
            "--radius-lg": "28px",
            "--radius-md": "20px",
            "--radius-pill": "999px",
            "--shadow-card": cardShadow,
            "--shadow-soft": softShadow,
            fontFamily: "'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 400,
            color: "var(--color-ink-900)",
            backgroundColor: "#f7fafc"
        },
        "html": {
            scrollBehavior: "smooth",
            backgroundColor: "#f7fafc"
        },
        "body": {
            margin: 0,
            color: "var(--color-ink-900)",
            background: "radial-gradient(circle at top left, rgba(40, 162, 124, 0.2), transparent 34rem), linear-gradient(180deg, #f7fbff 0%, #ffffff 46%, #f8fbf9 100%)",
            fontFamily: "inherit",
            fontWeight: 400,
            lineHeight: 1.75,
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased"
        },
        "body::before": {
            content: "''",
            position: "fixed",
            inset: 0,
            zIndex: -1,
            backgroundImage: "linear-gradient(rgba(16, 32, 51, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 32, 51, 0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 70%)"
        },
        "a": {
            color: "inherit",
            textDecoration: "none"
        },
        "img": {
            display: "block",
            maxWidth: "100%",
            height: "auto"
        },
        "button": {
            font: "inherit"
        },
        ".page-shell": {
            minHeight: "100vh",
            overflow: "hidden"
        },
        ".container": {
            width: "min(calc(100% - 40px), var(--max-width))",
            marginInline: "auto"
        },
        ".site-header": {
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid rgba(233, 238, 245, 0.75)",
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(20px)"
        },
        ".nav": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            paddingBlock: "16px"
        },
        ".brand": {
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: 600,
            letterSpacing: "-0.01em"
        },
        ".brand img": {
            width: "40px",
            height: "40px",
            borderRadius: "14px",
            boxShadow: "0 10px 24px rgba(16, 32, 51, 0.16)"
        },
        ".nav-links": {
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "var(--color-ink-500)",
            fontSize: "0.94rem",
            fontWeight: 500
        },
        ".nav-links a": {
            transition: "color 160ms ease"
        },
        ".nav-links a:hover": {
            color: "var(--color-brand-700)"
        },
        ".header-cta": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40px",
            paddingInline: "18px",
            border: "1px solid rgba(40, 162, 124, 0.32)",
            borderRadius: "var(--radius-pill)",
            color: "var(--color-brand-700)",
            background: "rgba(236, 253, 245, 0.9)",
            fontWeight: 600
        },
        ".language-menu": {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-ink-500)",
            fontSize: "0.9rem",
            fontWeight: 500
        },
        ".language-select-wrap": {
            position: "relative",
            display: "inline-flex",
            alignItems: "center"
        },
        ".language-select-wrap::after": {
            content: "''",
            position: "absolute",
            right: "14px",
            width: "7px",
            height: "7px",
            borderRight: "2px solid var(--color-ink-500)",
            borderBottom: "2px solid var(--color-ink-500)",
            transform: "translateY(-2px) rotate(45deg)",
            pointerEvents: "none"
        },
        ".language-select": {
            minHeight: "40px",
            minWidth: "112px",
            padding: "0 34px 0 14px",
            border: "1px solid rgba(49, 68, 93, 0.18)",
            borderRadius: "var(--radius-pill)",
            color: "var(--color-ink-700)",
            background: "rgba(255, 255, 255, 0.88)",
            appearance: "none",
            WebkitAppearance: "none",
            font: "inherit",
            fontWeight: 500
        },
        ".hero-section": {
            position: "relative",
            paddingBlock: "92px 88px"
        },
        ".hero-grid": {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(340px, 0.95fr)",
            alignItems: "center",
            gap: "64px"
        },
        ".eyebrow": {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            padding: "8px 14px",
            border: "1px solid rgba(40, 162, 124, 0.22)",
            borderRadius: "var(--radius-pill)",
            color: "var(--color-brand-700)",
            background: "rgba(236, 253, 245, 0.92)",
            fontSize: "0.88rem",
            fontWeight: 600
        },
        ".eyebrow::before": {
            content: "''",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--color-brand-500)",
            boxShadow: "0 0 0 6px rgba(40, 162, 124, 0.12)"
        },
        ".hero-title": {
            margin: "22px 0 20px",
            fontSize: "clamp(2.7rem, 7vw, 5.9rem)",
            lineHeight: 0.98,
            letterSpacing: "-0.055em",
            fontWeight: 700
        },
        ".hero-title span": {
            display: "block",
            color: "var(--color-brand-600)"
        },
        ".hero-lead": {
            maxWidth: "680px",
            margin: 0,
            color: "var(--color-ink-700)",
            fontSize: "clamp(1.06rem, 2vw, 1.28rem)",
            lineHeight: 1.95
        },
        ".hero-actions": {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "14px",
            marginTop: "34px"
        },
        ".primary-button, .secondary-button": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "52px",
            padding: "0 24px",
            borderRadius: "var(--radius-pill)",
            fontWeight: 600,
            letterSpacing: "0"
        },
        ".primary-button": {
            color: "#ffffff",
            background: "linear-gradient(135deg, var(--color-brand-600), var(--color-brand-500))",
            boxShadow: "0 18px 38px rgba(22, 133, 100, 0.25)"
        },
        ".secondary-button": {
            border: "1px solid var(--color-line-100)",
            color: "var(--color-ink-700)",
            background: "rgba(255, 255, 255, 0.78)"
        },
        ".hero-note": {
            marginTop: "18px",
            color: "var(--color-ink-500)",
            fontSize: "0.94rem"
        },
        ".hero-visual": {
            position: "relative",
            minHeight: "560px"
        },
        ".phone-card": {
            position: "relative",
            width: "min(100%, 390px)",
            marginInline: "auto",
            padding: "18px",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            borderRadius: "42px",
            background: "linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(236, 253, 245, 0.72))",
            boxShadow: cardShadow
        },
        ".phone-screen": {
            minHeight: "560px",
            padding: "26px",
            border: "1px solid rgba(233, 238, 245, 0.95)",
            borderRadius: "32px",
            background: "#ffffff",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.7)"
        },
        ".app-topbar": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "26px"
        },
        ".app-topbar img": {
            width: "54px",
            height: "54px",
            borderRadius: "18px",
            boxShadow: "0 12px 28px rgba(16, 32, 51, 0.16)"
        },
        ".pill": {
            display: "inline-flex",
            alignItems: "center",
            minHeight: "32px",
            paddingInline: "12px",
            borderRadius: "var(--radius-pill)",
            color: "var(--color-brand-700)",
            background: "var(--color-brand-50)",
            fontSize: "0.82rem",
            fontWeight: 600
        },
        ".app-title": {
            margin: "0 0 16px",
            fontSize: "1.55rem",
            lineHeight: 1.4,
            letterSpacing: "-0.025em",
            fontWeight: 600
        },
        ".timeline": {
            display: "grid",
            gap: "14px",
            marginTop: "24px"
        },
        ".timeline-item": {
            display: "grid",
            gridTemplateColumns: "46px 1fr",
            gap: "14px",
            alignItems: "center",
            padding: "16px",
            border: "1px solid var(--color-line-100)",
            borderRadius: "22px",
            background: "#fbfdff"
        },
        ".timeline-icon": {
            display: "grid",
            placeItems: "center",
            width: "46px",
            height: "46px",
            borderRadius: "16px",
            color: "#ffffff",
            background: "var(--color-brand-500)",
            fontWeight: 600
        },
        ".timeline-item:nth-child(2) .timeline-icon": {
            background: "#5b8def"
        },
        ".timeline-item:nth-child(3) .timeline-icon": {
            background: "#f4b740"
        },
        ".timeline-label": {
            margin: 0,
            color: "var(--color-ink-900)",
            fontWeight: 600,
            lineHeight: 1.45
        },
        ".timeline-time": {
            margin: "4px 0 0",
            color: "var(--color-ink-500)",
            fontSize: "0.88rem",
            lineHeight: 1.5
        },
        ".floating-card": {
            position: "absolute",
            right: "-2px",
            bottom: "58px",
            width: "min(78%, 300px)",
            padding: "18px",
            border: "1px solid rgba(233, 238, 245, 0.96)",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow: softShadow,
            backdropFilter: "blur(14px)"
        },
        ".floating-card strong": {
            display: "block",
            marginBottom: "6px"
        },
        ".floating-card p": {
            margin: 0,
            color: "var(--color-ink-500)",
            fontSize: "0.92rem"
        },
        ".feature-graphic-section": {
            paddingBlock: "8px 56px"
        },
        ".feature-graphic": {
            overflow: "hidden",
            border: "1px solid rgba(233, 238, 245, 0.96)",
            borderRadius: "34px",
            background: "#ffffff",
            boxShadow: cardShadow
        },
        ".feature-graphic[hidden]": {
            display: "none"
        },
        ".feature-graphic img": {
            width: "100%",
            height: "auto"
        },
        ".section": {
            paddingBlock: "78px"
        },
        ".section-header": {
            maxWidth: "760px",
            marginBottom: "36px"
        },
        ".section-kicker": {
            margin: "0 0 10px",
            color: "var(--color-brand-700)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.78rem"
        },
        ".section-title": {
            margin: 0,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.04em",
            fontWeight: 600
        },
        ".section-lead": {
            margin: "16px 0 0",
            color: "var(--color-ink-700)",
            fontSize: "1.05rem"
        },
        ".problem-grid, .feature-grid, .usecase-grid": {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px"
        },
        ".problem-card, .feature-card, .usecase-card, .pro-card, .faq-item": {
            border: "1px solid var(--color-line-100)",
            borderRadius: "var(--radius-lg)",
            background: "rgba(255, 255, 255, 0.86)",
            boxShadow: "0 12px 34px rgba(18, 36, 66, 0.06)"
        },
        ".problem-card, .feature-card, .usecase-card": {
            padding: "28px"
        },
        ".card-icon": {
            display: "grid",
            placeItems: "center",
            width: "50px",
            height: "50px",
            marginBottom: "20px",
            borderRadius: "18px",
            background: "var(--color-brand-50)",
            color: "var(--color-brand-700)",
            fontWeight: 600
        },
        ".problem-card h3, .feature-card h3, .usecase-card h3, .pro-card h3": {
            margin: "0 0 10px",
            fontSize: "1.25rem",
            lineHeight: 1.45,
            letterSpacing: "-0.015em",
            fontWeight: 600
        },
        ".problem-card p, .feature-card p, .usecase-card p, .pro-card p": {
            margin: 0,
            color: "var(--color-ink-500)"
        },
        ".flow-section": {
            position: "relative"
        },
        ".flow-grid": {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
            counterReset: "flow"
        },
        ".flow-card": {
            position: "relative",
            padding: "30px",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(180deg, #ffffff, #f7fffb)",
            boxShadow: softShadow,
            counterIncrement: "flow"
        },
        ".flow-card::before": {
            content: "counter(flow, decimal-leading-zero)",
            display: "grid",
            placeItems: "center",
            width: "48px",
            height: "48px",
            marginBottom: "24px",
            borderRadius: "16px",
            color: "#ffffff",
            background: "var(--color-ink-900)",
            fontWeight: 600
        },
        ".flow-card h3": {
            margin: "0 0 10px",
            fontSize: "1.3rem",
            letterSpacing: "-0.015em",
            fontWeight: 600
        },
        ".flow-card p": {
            margin: 0,
            color: "var(--color-ink-500)"
        },
        ".feature-card": {
            minHeight: "250px"
        },
        ".screenshots-section": {
            overflow: "hidden"
        },
        ".screenshot-gallery": {
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(220px, 260px)",
            gap: "18px",
            overflowX: "auto",
            padding: "8px 4px 24px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "thin"
        },
        ".screenshot-gallery[hidden]": {
            display: "none"
        },
        ".screenshot-gallery img": {
            width: "100%",
            height: "auto",
            border: "1px solid rgba(233, 238, 245, 0.96)",
            borderRadius: "28px",
            background: "#ffffff",
            boxShadow: "0 18px 44px rgba(18, 36, 66, 0.14)",
            scrollSnapAlign: "start"
        },
        ".pro-panel": {
            display: "grid",
            gridTemplateColumns: "0.8fr 1.2fr",
            gap: "28px",
            alignItems: "stretch",
            padding: "28px",
            borderRadius: "36px",
            background: "linear-gradient(135deg, var(--color-ink-900), #183a34)",
            color: "#ffffff",
            boxShadow: cardShadow
        },
        ".pro-copy": {
            padding: "12px"
        },
        ".pro-copy .section-kicker, .pro-copy .section-lead": {
            color: "rgba(255, 255, 255, 0.76)"
        },
        ".pro-copy .section-title": {
            color: "#ffffff"
        },
        ".pro-grid": {
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px"
        },
        ".pro-card": {
            padding: "22px",
            background: "rgba(255, 255, 255, 0.09)",
            borderColor: "rgba(255, 255, 255, 0.14)",
            boxShadow: "none"
        },
        ".pro-card p": {
            color: "rgba(255, 255, 255, 0.7)"
        },
        ".faq-grid": {
            display: "grid",
            gap: "14px"
        },
        ".faq-item": {
            padding: "24px 28px"
        },
        ".faq-item h3": {
            margin: "0 0 8px",
            fontSize: "1.1rem"
        },
        ".faq-item p": {
            margin: 0,
            color: "var(--color-ink-500)"
        },
        ".final-cta": {
            paddingBlock: "86px 96px"
        },
        ".cta-panel": {
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "28px",
            alignItems: "center",
            padding: "42px",
            borderRadius: "38px",
            background: "linear-gradient(135deg, #ffffff, var(--color-brand-50))",
            boxShadow: cardShadow
        },
        ".cta-panel h2": {
            margin: 0,
            fontSize: "clamp(2rem, 4vw, 3.4rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.04em",
            fontWeight: 600
        },
        ".cta-panel p": {
            maxWidth: "680px",
            margin: "14px 0 0",
            color: "var(--color-ink-700)"
        },
        ".store-status": {
            display: "grid",
            gap: "10px",
            minWidth: "220px"
        },
        ".store-badge": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "54px",
            paddingInline: "20px",
            borderRadius: "18px",
            color: "var(--color-ink-900)",
            background: "#ffffff",
            boxShadow: "0 10px 28px rgba(18, 36, 66, 0.08)",
            fontWeight: 600
        },
        ".site-footer": {
            paddingBlock: "28px 42px",
            borderTop: "1px solid var(--color-line-100)",
            color: "var(--color-ink-500)"
        },
        ".footer-inner": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            fontSize: "0.92rem"
        },
        ".footer-links": {
            display: "flex",
            flexWrap: "wrap",
            gap: "18px",
            color: "var(--color-ink-700)",
            fontWeight: 500
        },
        ".footer-links a": {
            transition: "color 160ms ease"
        },
        ".footer-links a:hover": {
            color: "var(--color-brand-700)"
        },
        ".reveal": {
            opacity: 0,
            transform: "translateY(18px)",
            transition: "opacity 520ms ease, transform 520ms ease"
        },
        ".reveal.is-visible": {
            opacity: 1,
            transform: "translateY(0)"
        },
        "@media (prefers-reduced-motion: reduce)": {
            "html": {
                scrollBehavior: "auto"
            },
            "*, *::before, *::after": {
                animationDuration: "1ms !important",
                animationIterationCount: "1 !important",
                scrollBehavior: "auto !important",
                transitionDuration: "1ms !important"
            },
            ".reveal": {
                opacity: 1,
                transform: "none"
            }
        },
        "@media (max-width: 960px)": {
            ".hero-grid, .pro-panel, .cta-panel": {
                gridTemplateColumns: "1fr"
            },
            ".hero-section": {
                paddingBlock: "72px 56px"
            },
            ".feature-graphic-section": {
                paddingBlock: "0 48px"
            },
            ".hero-visual": {
                minHeight: "auto"
            },
            ".problem-grid, .feature-grid, .usecase-grid, .flow-grid": {
                gridTemplateColumns: "1fr 1fr"
            },
            ".screenshot-gallery": {
                gridAutoColumns: "minmax(200px, 240px)"
            },
            ".cta-panel": {
                padding: "32px"
            }
        },
        "@media (max-width: 720px)": {
            ".container": {
                width: "min(calc(100% - 28px), var(--max-width))"
            },
            ".nav": {
                alignItems: "flex-start"
            },
            ".nav-links": {
                display: "none"
            },
            ".header-cta": {
                minHeight: "36px",
                paddingInline: "14px",
                fontSize: "0.84rem"
            },
            ".hero-section": {
                paddingBlock: "54px 44px"
            },
            ".feature-graphic-section": {
                paddingBlock: "0 40px"
            },
            ".feature-graphic": {
                borderRadius: "22px"
            },
            ".hero-actions": {
                alignItems: "stretch",
                flexDirection: "column"
            },
            ".primary-button, .secondary-button": {
                width: "100%"
            },
            ".phone-card": {
                width: "100%",
                borderRadius: "32px",
                padding: "12px"
            },
            ".phone-screen": {
                minHeight: "auto",
                padding: "22px",
                borderRadius: "24px"
            },
            ".floating-card": {
                position: "static",
                width: "auto",
                margin: "18px 10px 0"
            },
            ".section": {
                paddingBlock: "56px"
            },
            ".problem-grid, .feature-grid, .usecase-grid, .flow-grid, .pro-grid": {
                gridTemplateColumns: "1fr"
            },
            ".screenshot-gallery": {
                gridAutoColumns: "minmax(190px, 78vw)",
                gap: "14px"
            },
            ".problem-card, .feature-card, .usecase-card, .flow-card, .faq-item": {
                padding: "24px"
            },
            ".pro-panel": {
                padding: "24px",
                borderRadius: "28px"
            },
            ".final-cta": {
                paddingBlock: "62px 72px"
            },
            ".cta-panel": {
                padding: "26px",
                borderRadius: "28px"
            },
            ".footer-inner": {
                flexDirection: "column",
                alignItems: "flex-start"
            }
        }
    }
});
