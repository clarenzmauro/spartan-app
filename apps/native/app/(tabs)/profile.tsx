import { ScrollView, Text, View, Pressable, TouchableOpacity } from "react-native";
import ProfileContainer from "@/components/profile-container";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
	const { signOut } = useClerk();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await signOut();
			// Redirect to your desired page
			router.replace('/(auth)/sign-in');
		} catch (err) {
			// See https://clerk.com/docs/guides/development/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
			<ScrollView className="flex-1">
				{/* First Viewport - Profile Container + Buttons fit together */}
				<View className="h-screen justify-between">
					{/* Profile Container - Takes available space but not full screen */}
					<View className="flex-1">
						<ProfileContainer />
					</View>
				</View>

				{/* Profile Information Section - Scrollable below */}
				<View className="px-6 py-8">
					<Text className="text-3xl font-bold text-foreground mb-2">
						Profile
					</Text>
					<Text className="text-lg text-muted-foreground mb-6">
						Manage your account settings
					</Text>

					{/* Sign Out Button */}
					<TouchableOpacity
						onPress={handleSignOut}
						className="bg-red-500 px-6 py-3 rounded-lg mb-4"
					>
						<Text className="text-white text-center font-semibold">
							Sign Out
						</Text>
					</TouchableOpacity>

					{/* Add more profile information here */}
				</View>
			</ScrollView>
	);
}
