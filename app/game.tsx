import { SinglePlayerStoreProvider } from "@/contexts/GameStoreContext";
import { GameScreen } from "@/screens/GameScreen";

export default function Game() {
	return (
		<SinglePlayerStoreProvider>
			<GameScreen />
		</SinglePlayerStoreProvider>
	);
}
