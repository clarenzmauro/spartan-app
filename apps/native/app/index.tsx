import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
	const { isSignedIn, isLoaded } = useAuth();

	// Show loading state while checking authentication
	if (!isLoaded) {
		return (
			<View style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#F5F5F5'
			}}>
				<ActivityIndicator size="large" color="#910C24" />
				<Text style={{
					marginTop: 20,
					fontSize: 16,
					color: '#666',
					textAlign: 'center'
				}}>
					Loading...
				</Text>
			</View>
		);
	}

	// If user is authenticated, redirect to home tabs
	if (isSignedIn) {
		return <Redirect href="/(tabs)" />;
	}

	// If not authenticated, redirect to sign-in
	return <Redirect href="/(auth)/sign-in" />;
}
