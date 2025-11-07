import { Container } from "@/components/container";
import { ScrollView, Text, View, Pressable } from "react-native";
import ProfileContainer from "@/components/profile-container";

export default function ProfileScreen() {
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
					<Text className="text-lg text-muted-foreground">
						Manage your account settings
					</Text>
					{/* Add more profile information here */}
				</View>
			</ScrollView>
	);
}
