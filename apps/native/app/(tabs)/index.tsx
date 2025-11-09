import { Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F5F5F5" }} />;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#F5F5F5",
      }}
    >
      {/* red rectangle with rounded corners */}
      <View
        style={{
          width: "100%",
          height: "30%",
          borderRadius: 32,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: "#b30000",
          justifyContent: "flex-start",
          alignItems: "stretch",
          paddingTop: "5%",
        }}
      >
        {/* logo + bell */}
        <View className="flex-row justify-between items-center py-10 px-6">
          <Image
            source={require("../../assets/images/auth-screen/batangas-state-university-logo.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
            }}
          />
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>

        {/* student information */}
        <View className="flex-1 justify-end px-6 pb-6">
          <Text className="text-white text-lg font-semibold">
            {user?.lastName?.toUpperCase()}, {user?.firstName}
          </Text>
          <Text className="text-white text-sm">
            College of Informatics and Computing Sciences
          </Text>
        </View>
      </View>
    </View>
  );
}
