import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";

export default function BattlePage() {
  const { battleId } = useLocalSearchParams();
  
  // Mock battle data - replace with actual Convex query
  const [battle, setBattle] = useState({
    player1: {
      userId: "You",
      currentHP: 85,
      hpAmount: 100,
      atkAmount: 85,
      defAmount: 65,
    },
    player2: {
      userId: "Opponent",
      currentHP: 70,
      hpAmount: 100,
      atkAmount: 80,
      defAmount: 60,
    },
    currentTurn: "player1",
    turnCount: 3,
    battleLog: [
      { turn: 1, player: "player1", action: "attacked", damage: 15 },
      { turn: 2, player: "player2", action: "attacked", damage: 18 },
      { turn: 3, player: "player1", action: "defended", damage: 0 },
    ],
  });

  const isMyTurn = battle.currentTurn === "player1"; // Replace with actual user check

  const handleAttack = () => {
    console.log("Attack!");
    // Call Convex mutation to perform attack
  };

  const handleDefend = () => {
    console.log("Defend!");
    // Call Convex mutation to defend
  };

  const handleSkill = () => {
    console.log("Use Skill!");
    // Call Convex mutation to use skill
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      {/* Opponent Section - Top */}
      <View className="bg-red-900/30 rounded-2xl p-4 mb-4 border-2 border-red-700">
        <Text className="text-red-400 text-sm mb-2">OPPONENT</Text>
        <Text className="text-white font-bold text-lg mb-2">{battle.player2.userId}</Text>
        
        {/* HP Bar */}
        <View className="mb-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-white text-xs">HP</Text>
            <Text className="text-white text-xs">
              {battle.player2.currentHP} / {battle.player2.hpAmount}
            </Text>
          </View>
          <View className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <View 
              className="h-full bg-red-500"
              style={{ width: `${(battle.player2.currentHP / battle.player2.hpAmount) * 100}%` }}
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-4">
          <Text className="text-gray-400 text-xs">ATK: {battle.player2.atkAmount}</Text>
          <Text className="text-gray-400 text-xs">DEF: {battle.player2.defAmount}</Text>
        </View>
      </View>

      {/* Turn Indicator */}
      <View className="items-center mb-4">
        <View className={`px-6 py-2 rounded-full ${isMyTurn ? 'bg-green-600' : 'bg-gray-600'}`}>
          <Text className="text-white font-bold">
            {isMyTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
          </Text>
        </View>
        <Text className="text-gray-400 text-sm mt-1">Turn {battle.turnCount}</Text>
      </View>

      {/* Battle Log - Middle */}
      <View className="flex-1 bg-gray-800 rounded-2xl p-4 mb-4">
        <Text className="text-white font-bold mb-2">Battle Log</Text>
        <ScrollView className="flex-1">
          {battle.battleLog.map((log, index) => (
            <View key={index} className="mb-2 pb-2 border-b border-gray-700">
              <Text className="text-gray-300 text-sm">
                <Text className="text-yellow-400">Turn {log.turn}:</Text>{" "}
                <Text className={log.player === "player1" ? "text-blue-400" : "text-red-400"}>
                  {log.player === "player1" ? "You" : "Opponent"}
                </Text>{" "}
                {log.action}
                {log.damage ? ` for ${log.damage} damage!` : "!"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Player Section - Bottom */}
      <View className="bg-blue-900/30 rounded-2xl p-4 mb-4 border-2 border-blue-700">
        <Text className="text-blue-400 text-sm mb-2">YOU</Text>
        <Text className="text-white font-bold text-lg mb-2">{battle.player1.userId}</Text>
        
        {/* HP Bar */}
        <View className="mb-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-white text-xs">HP</Text>
            <Text className="text-white text-xs">
              {battle.player1.currentHP} / {battle.player1.hpAmount}
            </Text>
          </View>
          <View className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <View 
              className="h-full bg-green-500"
              style={{ width: `${(battle.player1.currentHP / battle.player1.hpAmount) * 100}%` }}
            />
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-4">
          <Text className="text-gray-400 text-xs">ATK: {battle.player1.atkAmount}</Text>
          <Text className="text-gray-400 text-xs">DEF: {battle.player1.defAmount}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-2">
        {isMyTurn ? (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleAttack}
              className="flex-1 bg-red-600 rounded-lg py-4"
            >
              <Text className="text-white text-center font-bold">⚔️ ATTACK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDefend}
              className="flex-1 bg-blue-600 rounded-lg py-4"
            >
              <Text className="text-white text-center font-bold">🛡️ DEFEND</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSkill}
              className="flex-1 bg-purple-600 rounded-lg py-4"
            >
              <Text className="text-white text-center font-bold">✨ SKILL</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-gray-700 rounded-lg py-4">
            <Text className="text-gray-400 text-center font-bold">Waiting for opponent...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
