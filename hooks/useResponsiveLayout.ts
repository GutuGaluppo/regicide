import { useWindowDimensions } from "react-native";

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1100;
const WIDE_BREAKPOINT = 1440;

export const useResponsiveLayout = () => {
	const { width, height } = useWindowDimensions();

	const isTablet = width >= TABLET_BREAKPOINT;
	const isDesktop = width >= DESKTOP_BREAKPOINT;
	const isWide = width >= WIDE_BREAKPOINT;

	const screenPadding = isDesktop ? 32 : isTablet ? 24 : 16;
	const contentMaxWidth = isWide ? 1360 : isDesktop ? 1200 : 960;
	const readingMaxWidth = isWide ? 1120 : isDesktop ? 1024 : 860;

	return {
		width,
		height,
		isTablet,
		isDesktop,
		isWide,
		screenPadding,
		contentMaxWidth,
		readingMaxWidth,
	};
};
