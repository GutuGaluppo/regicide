import { useAudio } from "@/contexts/AudioContext";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ConfirmModal.styles";

interface ConfirmModalProps {
	visible: boolean;
	title: string;
	message?: string;
	confirmLabel: string;
	cancelLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
	/** Styles the confirm button as a destructive action. */
	destructive?: boolean;
}

export const ConfirmModal = ({
	visible,
	title,
	message,
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel,
	destructive = false,
}: ConfirmModalProps) => {
	const { playTap } = useAudio();

	const handleConfirm = () => {
		playTap();
		onConfirm();
	};
	const handleCancel = () => {
		playTap();
		onCancel();
	};

	return (
		<Modal
			transparent
			visible={visible}
			onRequestClose={handleCancel}
			statusBarTranslucent
			animationType="fade"
		>
			<Pressable style={styles.backdrop} onPress={handleCancel}>
				{/* Stop propagation so taps inside the card don't dismiss it. */}
				<Pressable style={styles.card} onPress={() => {}}>
					<Text style={styles.title}>{title}</Text>
					{message ? <Text style={styles.body}>{message}</Text> : null}

					<View style={styles.buttonRow}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={handleCancel}
							activeOpacity={0.8}
						>
							<Text style={styles.cancelText}>{cancelLabel}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.button,
								destructive ? styles.confirmButtonDanger : styles.confirmButton,
							]}
							onPress={handleConfirm}
							activeOpacity={0.8}
						>
							<Text style={styles.confirmText}>{confirmLabel}</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
