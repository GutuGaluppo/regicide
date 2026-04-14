import React from "react";
import { View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import { styles } from "./ProgressRing.styles";

interface ProgressRingProps {
	percent: number; // 0..1
	size: number;
	strokeWidth?: number;
	color: string;
	children?: React.ReactNode;
}

export const ProgressRing = ({
	percent,
	size,
	strokeWidth = 5,
	color,
	children,
}: ProgressRingProps) => {
	const radius = (size - strokeWidth) / 2;
	const cx = size / 2;
	const cy = size / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * (1 - Math.max(0, Math.min(1, percent)));

	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} style={styles.svgAbsoluteFill}>
				{/* Fundo branco + trilha cinza */}
				<Circle
					cx={cx}
					cy={cy}
					r={radius}
					stroke="rgba(148,163,184,0.35)"
					strokeWidth={strokeWidth}
					fill="white"
				/>
				{/* Arco de progresso */}
				<Circle
					cx={cx}
					cy={cy}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					rotation={-90}
					origin={`${cx}, ${cy}`}
				/>
			</Svg>
			<View style={styles.content}>{children}</View>
		</View>
	);
};
