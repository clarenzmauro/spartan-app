import { Container } from "@/components/container";
import { ScrollView, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
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
            MAURO, CLARENZ ANDREW D.
          </Text>
          <Text className="text-white text-sm">
            College of Informatics and Computing Sciences
          </Text>
        </View>
      </View>
    </View>
  );
}
