import { GameLogEntry } from "@/data/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { styles } from "./GameLog.styles";
import { LogEntryRow } from "./LogEntryRow";

interface Props {
	visible: boolean;
	entries: GameLogEntry[];
	onClose: () => void;
}

/**
 * Histórico de ações da partida (tracker). Mostra as entradas mais recentes no
 * topo. Reutilizável na partida (botão do header) e nas telas de fim.
 */
export const GameLogModal = ({ visible, entries, onClose }: Props) => {
	const { t } = useTranslation();
	// Mais recentes no topo (entradas chegam em ordem cronológica ascendente).
	const data = React.useMemo(() => [...entries].reverse(), [entries]);

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<Pressable style={styles.backdrop} onPress={onClose}>
				<Pressable style={styles.panel} onPress={() => {}}>
					<View style={styles.header}>
						<Text style={styles.title}>{t("game.log.title")}</Text>
						<Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
							<Text style={styles.close}>✕</Text>
						</Pressable>
					</View>

					{data.length === 0 ? (
						<Text style={styles.empty}>{t("game.log.empty")}</Text>
					) : (
						<FlatList
							data={data}
							keyExtractor={(e) => e.id}
							renderItem={({ item }) => <LogEntryRow entry={item} />}
							contentContainerStyle={styles.list}
						/>
					)}
				</Pressable>
			</Pressable>
		</Modal>
	);
};
