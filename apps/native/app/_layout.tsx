import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Image } from "react-native";
import "../global.css";
import { NAV_THEME } from "@/lib/constants";
import React, { useRef } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Platform } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

// Initial route is controlled by index.tsx redirect

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
	unsavedChangesWarning: false,
});

export default function RootLayout() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const [isSplashVisible, setIsSplashVisible] = React.useState(true);

	// Prevent native splash from auto-hiding and manage custom splash
	React.useEffect(() => {
		SplashScreen.preventAutoHideAsync();

		// Hide custom splash after 1.5 seconds, then hide native splash
		const timer = setTimeout(async () => {
			setIsSplashVisible(false);
			await SplashScreen.hideAsync();
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			document.documentElement.classList.add("bg-background");
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	// Show splash screen with logo
	if (isSplashVisible || !isColorSchemeLoaded) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
				<Image
					source={require('@/assets/images/splash-screen/red-spartan-logo.png')}
					style={{ width: 200, height: 200, resizeMode: 'contain' }}
				/>
			</View>
		);
	}

	return (
		<ClerkProvider
			tokenCache={tokenCache}
			publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
		>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
					<GestureHandlerRootView style={{ flex: 1 }}>
						<SafeAreaProvider>
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(tabs)" />
								<Stack.Screen name="(auth)" />
								<Stack.Screen name="+not-found" />
							</Stack>
						</SafeAreaProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
