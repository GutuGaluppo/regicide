import { AvatarId } from "@/data/types";

export interface Avatar {
	id: AvatarId;
	/** Nome próprio do personagem (não traduzido). */
	label: string;
	/** Asset local resolvido via require. */
	image: number;
}

/**
 * Catálogo fixo de avatares locais. Apenas o `id` trafega/persiste; o mapeamento
 * id → imagem/label vive aqui. Reaproveita a arte de personagens já no app.
 */
export const AVATARS: Avatar[] = [
	{ id: "bern", label: "Bern", image: require("@/assets/avatar/Bern.png") },
	{ id: "cau", label: "Cau", image: require("@/assets/avatar/Cau.png") },
	{ id: "celio", label: "Celio", image: require("@/assets/avatar/Celio.png") },
	{ id: "lamp", label: "Lamp", image: require("@/assets/avatar/Lamp.png") },
	{
		id: "pippin",
		label: "Pippin",
		image: require("@/assets/avatar/Pippin.png"),
	},
	{
		id: "thilli",
		label: "Thilli",
		image: require("@/assets/avatar/Thilli.png"),
	},
];

export const DEFAULT_AVATAR_ID: AvatarId = AVATARS[0].id;

/**
 * Resolvedor defensivo — única porta de entrada usada pela UI.
 * `id` ausente/desconhecido/adulterado cai no avatar padrão, então um id inválido
 * nunca chega a um `require`/`<Image>` quebrado.
 */
export const resolveAvatar = (id: AvatarId | undefined | null): Avatar =>
	AVATARS.find((a) => a.id === id) ?? AVATARS[0];
