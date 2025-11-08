import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
	const { isSignedIn, isLoaded } = useAuth();

	// Show loading state while checking authentication
	if (!isLoaded) {
		return null;
	}

	// If user is authenticated, redirect to home tabs
	if (isSignedIn) {
		return <Redirect href="/(tabs)" />;
	}

	// If not authenticated, redirect to sign-in
	return <Redirect href="/(auth)/sign-in" />;
}
