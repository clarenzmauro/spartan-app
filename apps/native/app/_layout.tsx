import { ConvexReactClient } from "convex/react";
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
import { View } from "react-native";
import "../global.css";
import { NAV_THEME } from "@/lib/constants";
import React, { useRef } from "react";
import { useColorScheme } from "@/lib/use-color-scheme";
import { Platform, Dimensions } from "react-native";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing
} from 'react-native-reanimated';

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
	const [showLogo, setShowLogo] = React.useState(false);

	// Get screen dimensions for engulfing animation
	const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
	const squareSize = 80;
	const maxDimension = Math.max(screenWidth, screenHeight);
	const engulfScale = maxDimension / squareSize;

	// Animation values
	const rotation = useSharedValue(0);
	const scale = useSharedValue(1);

	// Rectangle animation style
	const rectangleStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotate: `${rotation.value}deg` },
				{ scale: scale.value }
			],
		};
	});

	// Logo animation style
	const logoStyle = useAnimatedStyle(() => {
		return {
			opacity: showLogo ? 1 : 0,
			transform: [{ scale: showLogo ? 1 : 0.8 }],
		};
	});

	// Start animation sequence when splash becomes visible
	React.useEffect(() => {
		if (isSplashVisible && isColorSchemeLoaded) {
			// Counter-clockwise spin slow to fast for 1 second
			rotation.value = withTiming(-360, {
				duration: 1000,
				easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) // slow start, fast end
			}, () => {
				// Scale down for 0.4 seconds
				scale.value = withTiming(0.3, { duration: 400 }, () => {
					// Scale up and clockwise spin slow to fast for 1 second
					scale.value = withTiming(1.2, { duration: 500 });
					rotation.value = withTiming(360, {
						duration: 1000,
						easing: Easing.bezier(0.25, 0.46, 0.45, 0.94)
					}, () => {
						// Engulf the screen while spinning fast for 0.6 seconds
						scale.value = withTiming(engulfScale, { duration: 600 });
						rotation.value = withTiming(rotation.value + 720, {
							duration: 600,
							easing: Easing.bezier(0.25, 0.46, 0.45, 0.94)
						}, () => {
							// Show logo after engulfing animation completes
							runOnJS(setShowLogo)(true);
						});
					});
				});
			});
		}
	}, [isSplashVisible, isColorSchemeLoaded, engulfScale]);

	// Prevent native splash from auto-hiding and manage custom splash
	React.useEffect(() => {
		SplashScreen.preventAutoHideAsync();

		// Hide custom splash after 4.5 seconds to allow animation to complete, then hide native splash
		const timer = setTimeout(async () => {
			setIsSplashVisible(false);
			await SplashScreen.hideAsync();
		}, 4500);

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

	// Show splash screen with rectangle animation
	if (isSplashVisible || !isColorSchemeLoaded) {
		return (
			<View style={{ flex: 1, backgroundColor: showLogo ? 'white' : '#b30000', justifyContent: 'center', alignItems: 'center' }}>
				{!showLogo && (
					<Animated.View
						style={[
							{
								width: 80,
								height: 80,
								backgroundColor: 'white',
								borderRadius: 8,
							},
							rectangleStyle,
						]}
					/>
				)}
				{showLogo && (
					<Animated.Image
						source={require('@/assets/images/splash-screen/red-spartan-logo.png')}
						style={[
							{ width: 200, height: 200, resizeMode: 'contain' },
							logoStyle,
						]}
					/>
				)}
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
