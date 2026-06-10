import { Ionicons } from "@expo/vector-icons";
import { AbandonRequest } from "@/data/types";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
	Animated,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
} from "react-native";

type Props = {
	abandonRequest: AbandonRequest;
	myPlayerId: string;
	playerCount: number;
	onAgree: () => void;
	onRefuse: () => void;
};

export const AbandonVoteModal = ({
	abandonRequest,
	myPlayerId,
	playerCount,
	onAgree,
	onRefuse,
}: Props) => {
	const slideY = useRef(new Animated.Value(300)).current;
	const backdropOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
			Animated.spring(slideY, { toValue: 0, tension: 60, friction: 18, useNativeDriver: true }),
		]).start();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const { t } = useTranslation();
	const isRequester = abandonRequest.requestedBy === myPlayerId;
	const votes = abandonRequest.votes ?? {};
	const agreedCount = Object.values(votes).filter(Boolean).length;
	const pendingCount = playerCount - Object.keys(votes).length;
	const alreadyVoted = myPlayerId in votes;

	return (
		<Modal transparent visible animationType="none" statusBarTranslucent>
			<Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
				<Pressable style={styles.backdropFill} />
			</Animated.View>

			<Animated.View style={[styles.panel, { transform: [{ translateY: slideY }] }]}>
				<View style={styles.handle} />

				<View style={styles.iconRow}>
					<Text style={styles.flagIcon}>🏳️</Text>
				</View>

				{isRequester ? (
					<>
						<Text style={styles.title}>{t("multiplayer.abandon.sent")}</Text>
						<Text style={styles.body}>{t("multiplayer.abandon.sentWaiting")}</Text>
						<View style={styles.progressRow}>
							<Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
							<Text style={styles.progressText}>
								{t("multiplayer.abandon.progress", { agreed: agreedCount, total: playerCount })}
								{pendingCount > 0 ? t("multiplayer.abandon.progressPending", { pending: pendingCount }) : ""}
							</Text>
						</View>
					</>
				) : alreadyVoted ? (
					<>
						<Text style={styles.title}>{t("multiplayer.abandon.voted")}</Text>
						<Text style={styles.body}>
							{votes[myPlayerId]
								? t("multiplayer.abandon.agreed")
								: t("multiplayer.abandon.refused")}
						</Text>
						<View style={styles.progressRow}>
							<Ionicons name="time-outline" size={16} color="#94A3B8" />
							<Text style={styles.progressText}>{t("multiplayer.abandon.waitingOthers")}</Text>
						</View>
					</>
				) : (
					<>
						<Text style={styles.title}>{t("multiplayer.abandon.title")}</Text>
						<Text style={styles.body}>
							<Text style={styles.requesterName}>
								{abandonRequest.requestedByName}
							</Text>
							{t("multiplayer.abandon.bodySuffix")}
						</Text>

						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={[styles.btn, styles.btnRefuse]}
								onPress={onRefuse}
								activeOpacity={0.8}
							>
								<Ionicons name="close" size={18} color="#F87171" />
								<Text style={[styles.btnText, styles.btnTextRefuse]}>{t("multiplayer.abandon.refuse")}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.btn, styles.btnAgree]}
								onPress={onAgree}
								activeOpacity={0.8}
							>
								<Ionicons name="checkmark" size={18} color="#0f172a" />
								<Text style={[styles.btnText, styles.btnTextAgree]}>{t("multiplayer.abandon.agree")}</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.65)",
	},
	backdropFill: {
		...StyleSheet.absoluteFillObject,
	},
	panel: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#0F172A",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		borderColor: "rgba(248,113,113,0.3)",
		paddingBottom: 48,
		paddingHorizontal: 24,
		paddingTop: 4,
	},
	handle: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "rgba(148,163,184,0.35)",
		marginTop: 10,
		marginBottom: 20,
	},
	iconRow: {
		alignItems: "center",
		marginBottom: 12,
	},
	flagIcon: {
		fontSize: 36,
	},
	title: {
		color: "#F1F5F9",
		fontSize: 18,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 10,
	},
	body: {
		color: "#94A3B8",
		fontSize: 15,
		textAlign: "center",
		lineHeight: 22,
		marginBottom: 24,
	},
	requesterName: {
		color: "#E8D5A3",
		fontWeight: "600",
	},
	progressRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginTop: 4,
	},
	progressText: {
		color: "#64748B",
		fontSize: 13,
	},
	buttonRow: {
		flexDirection: "row",
		gap: 12,
	},
	btn: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	btnRefuse: {
		backgroundColor: "rgba(248,113,113,0.08)",
		borderColor: "rgba(248,113,113,0.4)",
	},
	btnAgree: {
		backgroundColor: "#4ADE80",
		borderColor: "#4ADE80",
	},
	btnText: {
		fontSize: 15,
		fontWeight: "600",
	},
	btnTextRefuse: {
		color: "#F87171",
	},
	btnTextAgree: {
		color: "#0f172a",
	},
});
