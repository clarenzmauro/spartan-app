import { Text, View, TouchableOpacity } from "react-native";

export default function ProfileContainer() {
  return (
    <View className="flex justify-center items-center flex-1 px-4 bg-red-100">
      {/* Black Container */}
      <View className="bg-black text-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 mb-4">
        {/* Temporary placeholder text */}
        <Text className="text-center text-gray-400">Profile Box Placeholder</Text>
        <Text className="text-center text-gray-400">Profile Box Placeholder</Text>
      </View>
    
      {/* Buttons Container */}
      <View className="w-full max-w-md">
        {/* Battle Button */}
        <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 mb-2">
          <Text className="text-white text-center font-bold text-lg">BATTLE</Text>
        </TouchableOpacity>

        {/* Dailies and Event Buttons Row */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 flex-1">
            <Text className="text-white text-center font-bold text-lg">DAILIES</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-neutral-800 rounded-lg py-4 flex-1">
            <Text className="text-white text-center font-bold text-lg">EVENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
