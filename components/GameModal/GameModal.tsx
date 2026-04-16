import { EnemyModal } from "@/components/EnemyModal";
import { useAudio } from "@/contexts/AudioContext";
import { Enemy } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { ModalState } from "@/screens/TrackerScreen/TrackerScreen.types";

interface GameModalProps {
	modalState: ModalState;
	onClose: () => void;
	enemy: Enemy | null;
	currentHP: number;
	effectiveAttack: number;
}

export const GameModal = ({
	modalState,
	onClose,
	enemy,
	currentHP,
	effectiveAttack,
}: GameModalProps) => {
	const { t } = useTranslation();
	const { playTap } = useAudio();

	const handleClose = () => {
		playTap();
		onClose();
	};

	if (modalState === "ENEMY_DETAILS" && enemy) {
		return (
			<EnemyModal
				enemy={enemy}
				currentHP={currentHP}
				effectiveAttack={effectiveAttack}
				visible
				onClose={handleClose}
			/>
		);
	}

	if (modalState === "IMMUNE_WARNING") {
		return (
			<Modal
				transparent
				visible
				onRequestClose={handleClose}
				statusBarTranslucent
				animationType="fade"
			>
				<Pressable style={styles.backdrop} onPress={handleClose}>
					<View style={styles.sheet}>
						<View style={styles.handle} />
						<Text style={styles.title}>{t("modal.immuneWarning.title")}</Text>
						<Text style={styles.body}>{t("modal.immuneWarning.body")}</Text>
						<TouchableOpacity style={styles.btn} onPress={handleClose} activeOpacity={0.8}>
							<Text style={styles.btnText}>{t("modal.ok")}</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Modal>
		);
	}

	if (modalState === "HINT") {
		return (
			<Modal
				transparent
				visible
				onRequestClose={handleClose}
				statusBarTranslucent
				animationType="fade"
			>
				<Pressable style={styles.backdrop} onPress={handleClose}>
					<View style={styles.sheet}>
						<View style={styles.handle} />
						<Text style={styles.title}>{t("modal.hint.title")}</Text>
						<Text style={styles.body}>{t("modal.hint.body")}</Text>
						<TouchableOpacity style={styles.btn} onPress={handleClose} activeOpacity={0.8}>
							<Text style={styles.btnText}>{t("modal.ok")}</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Modal>
		);
	}

	return null;
};

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		justifyContent: "flex-end",
	},
	sheet: {
		backgroundColor: "#1E293B",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 32,
		gap: 12,
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: "rgba(255,255,255,0.2)",
		borderRadius: 2,
		alignSelf: "center",
		marginBottom: 4,
	},
	title: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 17,
	},
	body: {
		color: "#94A3B8",
		fontSize: 14,
		lineHeight: 20,
	},
	btn: {
		marginTop: 4,
		backgroundColor: "#334155",
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: "center",
	},
	btnText: {
		color: "#F1F5F9",
		fontWeight: "700",
		fontSize: 15,
	},
});
