import { useColorScheme as useNativewindColorScheme } from "nativewind";
import React from "react";

export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } =
		useNativewindColorScheme();

	React.useEffect(() => {
		setColorScheme("light");
	}, [setColorScheme]);

	return {
		colorScheme: colorScheme ?? "light",
		isDarkColorScheme: colorScheme === "dark",
		setColorScheme,
		toggleColorScheme,
	};
}
