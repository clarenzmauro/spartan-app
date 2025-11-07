import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useAuth, useUser, useClerk, useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
	React.useEffect(() => {
		// Warm up the android browser to improve UX
		void WebBrowser.warmUpAsync();
		return () => {
			void WebBrowser.coolDownAsync();
		};
	}, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
	useWarmUpBrowser();

	const { isSignedIn } = useAuth();
	const { user, isLoaded: isUserLoaded } = useUser();
	const { signOut } = useClerk();
	const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

	// Track domain validation status
	const [isDomainValid, setIsDomainValid] = React.useState<boolean | null>(null);
	const [isValidating, setIsValidating] = React.useState(false);

	// Validate email domain after sign in
	React.useEffect(() => {
		if (isSignedIn && isUserLoaded && user?.emailAddresses?.[0]?.emailAddress) {
			const userEmail = user.emailAddresses[0].emailAddress;
			const isValid = userEmail.endsWith('@g.batstate-u.edu.ph');

			setIsDomainValid(isValid);
			setIsValidating(false);

			if (!isValid) {
				// Invalid domain - sign out immediately and show error
				signOut();
				alert('Access restricted to Batangas State University accounts (@g.batstate-u.edu.ph) only.');
			}
		} else if (isSignedIn && !isUserLoaded) {
			// User is signed in but data is still loading
			setIsValidating(true);
		} else if (!isSignedIn) {
			// Reset validation state when signed out
			setIsDomainValid(null);
			setIsValidating(false);
		}
	}, [isSignedIn, isUserLoaded, user, signOut]);

	const handleSignIn = React.useCallback(async () => {
		try {
			const { createdSessionId, setActive } = await startOAuthFlow({
				redirectUrl: Linking.createURL("/", { scheme: "mybettertapp" }),
			});

			if (createdSessionId) {
				setActive!({ session: createdSessionId });
			}
		} catch (err) {
			console.error("OAuth error:", JSON.stringify(err, null, 2));
		}
	}, []);

	// Show loading state during validation
	if (isValidating) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
				<Text style={{ fontSize: 24, marginBottom: 20 }}>Sign in</Text>
				<Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
					Verifying account...
				</Text>
				<View style={{
					backgroundColor: "#f5f5f5",
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 4,
				}}>
					<Text style={{ color: "#666", fontSize: 14, textAlign: "center" }}>
						Checking email domain access
					</Text>
				</View>
			</View>
		);
	}

	// Show success state (user is signed in with valid domain)
	if (isSignedIn && isDomainValid) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
				<Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome!</Text>
				<Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
					Successfully signed in as {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
				</Text>
				<View style={{
					backgroundColor: "#d4edda",
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 4,
					borderWidth: 1,
					borderColor: "#c3e6cb",
				}}>
					<Text style={{ color: "#155724", fontSize: 14, textAlign: "center" }}>
						Redirecting to home...
					</Text>
				</View>
			</View>
		);
	}

	// Default sign-in form
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
			<Text style={{ fontSize: 24, marginBottom: 20 }}>Sign in</Text>
			<TouchableOpacity
				onPress={handleSignIn}
				style={{
					backgroundColor: "#4285F4",
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 4,
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
					Sign in with Google
				</Text>
			</TouchableOpacity>
			<View style={{
				backgroundColor: "#f8f9fa",
				paddingHorizontal: 15,
				paddingVertical: 10,
				borderRadius: 4,
				marginTop: 20,
			}}>
				<Text style={{ color: "#6c757d", fontSize: 12, textAlign: "center" }}>
					Only @g.batstate-u.edu.ph accounts are allowed
				</Text>
			</View>
		</View>
	);
}
