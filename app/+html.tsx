import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

/**
 * Web-only HTML shell used by Expo Router when statically rendering each route.
 * Adds the PWA manifest, theme color, iOS "Add to Home Screen" meta tags
 * (iOS ignores the manifest), and registers the service worker.
 */
export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>

				{/* PWA */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#0a0703" />

				{/* iOS standalone (does not read the manifest) */}
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<meta name="apple-mobile-web-app-title" content="Regicide" />
				<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

				<ScrollViewStyleReset />

				<script dangerouslySetInnerHTML={{ __html: swRegister }} />
			</head>
			<body>{children}</body>
		</html>
	);
}

const swRegister = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (e) {
      console.warn('SW registration failed:', e);
    });
  });
}
`;
