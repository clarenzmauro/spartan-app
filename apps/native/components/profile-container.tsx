import { Text, View } from "react-native";

export default function ProfileContainer() {
  return (
    <View className="flex justify-center items-center flex-1 bg-red-100">
      {/* Black Container */}
      <View className="bg-black text-white rounded-2xl shadow-2xl w-[90%] max-w-md p-4 sm:p-6">
        {/* Temporary placeholder text */}
        <Text className="text-center text-gray-400">Profile Box Placeholder</Text>
      </View>
    </View>
  );
}
