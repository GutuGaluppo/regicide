import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.72)",
		paddingHorizontal: 24,
		paddingTop: 60,
		paddingBottom: 40,
	},
	title: {
		fontFamily: "Cinzel",
		fontSize: 28,
		color: "#E8D5A3",
		textAlign: "center",
		marginBottom: 32,
		letterSpacing: 2,
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 6,
	},
	section: {
		backgroundColor: "rgba(255,255,255,0.09)",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.35)",
		padding: 20,
		marginBottom: 20,
	},
	sectionTitle: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#dce9f8",
		marginTop: 12,
		letterSpacing: 1,
	},
	input: {
		backgroundColor: "rgba(255,255,255,0.12)",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.45)",
		color: "#F0E0B0",
		fontFamily: "IMFellEnglish",
		fontSize: 16,
		paddingHorizontal: 14,
		paddingVertical: 10,
		marginBottom: 12,
	},
	// Widget nome + avatar (passo "name")
	// Desktop: avatar no canto superior esquerdo; abaixo, input + botão na mesma linha.
	// Mobile: coluna — avatar centralizado no topo, input no meio, botão embaixo.
	identityContainer: {
		gap: 12,
	},
	identityAvatarDesktop: {
		alignSelf: "flex-start",
	},
	identityAvatarMobile: {
		alignSelf: "center",
	},
	identityInputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	identityInputColumn: {
		flexDirection: "column",
		gap: 12,
	},
	identityInput: {
		marginBottom: 0,
	},
	identityInputDesktop: {
		flex: 1,
	},
	identityInputMobile: {
		width: "100%",
	},
	identityConfirmMobile: {
		width: "100%",
		flex: 1,
		padding: 4,
	},
	button: {
		backgroundColor: "rgba(232,213,163,0.18)",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.5)",
		paddingVertical: 12,
		alignItems: "center",
	},
	buttonPrimary: {
		backgroundColor: "rgba(180,130,60,0.5)",
		borderColor: "rgba(232,213,163,0.8)",
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	buttonText: {
		fontFamily: "Cinzel",
		fontSize: 14,
		color: "#E8D5A3",
		letterSpacing: 1,
	},
	row: {
		flexDirection: "row",
		gap: 10,
	},
	inputFlex: {
		flex: 1,
		marginBottom: 0,
	},
	joinButton: {
		justifyContent: "center",
		paddingHorizontal: 18,
		marginBottom: 0,
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
		gap: 8,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "rgba(232,213,163,0.28)",
	},
	dividerText: {
		color: "#94A3B8",
		fontFamily: "IMFellEnglish",
		fontSize: 13,
	},
	// Lobby view
	roomCode: {
		fontFamily: "Cinzel",
		fontSize: 36,
		color: "#E8D5A3",
		textAlign: "center",
		letterSpacing: 10,
		marginBottom: 4,
	},
	roomCodeLabel: {
		fontFamily: "IMFellEnglish",
		fontSize: 12,
		color: "#94A3B8",
		textAlign: "center",
		marginBottom: 20,
		letterSpacing: 1,
	},
	shareButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		alignSelf: "center",
		backgroundColor: "rgba(232,213,163,0.18)",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "rgba(232,213,163,0.5)",
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginTop: 6,
		marginBottom: 10,
	},
	shareButtonText: {
		fontFamily: "Cinzel",
		fontSize: 13,
		color: "#E8D5A3",
		letterSpacing: 1,
	},
	playerList: {
		gap: 8,
		marginBottom: 16,
	},
	playerRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	playerDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#4ADE80",
	},
	playerDotHost: {
		backgroundColor: "#FBBF24",
	},
	playerName: {
		fontFamily: "IMFellEnglish",
		fontSize: 15,
		color: "#E2EAF4",
	},
	playerNameSelf: {
		color: "#F0E0B0",
	},
	playerTag: {
		fontFamily: "IMFellEnglish",
		fontSize: 11,
		color: "#94A3B8",
		marginLeft: 4,
	},
	waitingText: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#94A3B8",
		textAlign: "center",
		marginTop: 8,
		fontStyle: "italic",
	},
	error: {
		fontFamily: "IMFellEnglish",
		fontSize: 13,
		color: "#F87171",
		textAlign: "center",
		marginTop: 8,
	},
	content: {
		flex: 1,
		width: "100%",
		maxWidth: 480,
		alignSelf: "center",
	},
	backButton: {
		alignSelf: "flex-start",
		marginBottom: 24,
		padding: 4,
	},
	backIcon: {
		width: 30,
		height: 30,
	},
});
