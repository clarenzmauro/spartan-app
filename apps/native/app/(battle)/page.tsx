import { View, Text, TouchableOpacity, ScrollView, ImageBackground, Image } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "../../../../packages/backend/convex/_generated/api";
import type { Id } from "../../../../packages/backend/convex/_generated/dataModel";

export default function BattlePage() {
  const { battleId } = useLocalSearchParams<{ battleId: string }>();
  const cleanupMatchmaking = useMutation(api.matchmaking.cleanupMatchmakingForBattle);
  
  // Cleanup matchmaking entries when battle page loads
  useEffect(() => {
    if (battleId) {
      cleanupMatchmaking({ battleId: battleId as Id<"battles"> })
        .then((result) => console.log(`Cleaned up ${result.deleted} matchmaking entries`))
        .catch((error) => console.error("Error cleaning up matchmaking:", error));
    }
  }, [battleId]);
  
  // Mock battle data - replace with actual Convex query
  const [battle, setBattle] = useState({
    player1: {
      userId: "You",
      gender: "male",
      currentHP: 85,
      hpAmount: 100,
      atkAmount: 85,
      crtAmount: 72,
      defAmount: 65,
      spdAmount: 90,
      intAmount: 78,
    },
    player2: {
      userId: "Opponent",
      gender: "female",
      currentHP: 70,
      hpAmount: 100,
      atkAmount: 80,
      crtAmount: 68,
      defAmount: 60,
      spdAmount: 85,
      intAmount: 75,
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
    <ImageBackground
      source={require("../../assets/images/splash-screen/battle-bg.png")}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay for readability */}
      <View className="flex-1 bg-black/60">
        <View className="flex-1 p-4">
          {/* Turn Indicator - Top */}
          <View className="items-center mb-4 mt-8">
            <View className={`px-6 py-2 rounded-full ${isMyTurn ? 'bg-green-600' : 'bg-red-600'}`}>
              <Text className="text-white font-bold text-lg">
                {isMyTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
              </Text>
            </View>
            <Text className="text-white text-sm mt-1 bg-black/50 px-3 py-1 rounded">
              Turn {battle.turnCount}
            </Text>
          </View>

          {/* Characters Face-off */}
          <View className="flex-1 flex-row items-center justify-between px-4">
            {/* Player 1 (Left) - Male */}
            <View className="items-center flex-1">
              {/* Stats above character */}
              <View className="bg-blue-900/80 rounded-xl p-3 mb-3 border-2 border-blue-400">
                <Text className="text-blue-300 font-bold text-center mb-2">{battle.player1.userId}</Text>
                
                {/* HP Bar */}
                <View className="mb-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-white text-xs font-bold">HP</Text>
                    <Text className="text-white text-xs font-bold">
                      {battle.player1.currentHP}/{battle.player1.hpAmount}
                    </Text>
                  </View>
                  <View className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-green-500"
                      style={{ width: `${(battle.player1.currentHP / battle.player1.hpAmount) * 100}%` }}
                    />
                  </View>
                </View>

                {/* Stats Grid */}
                <View className="gap-1">
                  <Text className="text-gray-200 text-xs">ATK: {battle.player1.atkAmount}</Text>
                  <Text className="text-gray-200 text-xs">DEF: {battle.player1.defAmount}</Text>
                  <Text className="text-gray-200 text-xs">CRT: {battle.player1.crtAmount}</Text>
                  <Text className="text-gray-200 text-xs">SPD: {battle.player1.spdAmount}</Text>
                  <Text className="text-gray-200 text-xs">INT: {battle.player1.intAmount}</Text>
                </View>
              </View>

              {/* Male Character */}
              <Image
                source={require("../../assets/images/male-character/male_4_cropped.png")}
                className="w-40 h-52"
                resizeMode="contain"
              />
            </View>

            {/* VS Indicator */}
            <View className="bg-yellow-500 rounded-full w-16 h-16 items-center justify-center mx-2">
              <Text className="text-black font-bold text-2xl">VS</Text>
            </View>

            {/* Player 2 (Right) - Female */}
            <View className="items-center flex-1">
              {/* Stats above character */}
              <View className="bg-red-900/80 rounded-xl p-3 mb-3 border-2 border-red-400">
                <Text className="text-red-300 font-bold text-center mb-2">{battle.player2.userId}</Text>
                
                {/* HP Bar */}
                <View className="mb-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-white text-xs font-bold">HP</Text>
                    <Text className="text-white text-xs font-bold">
                      {battle.player2.currentHP}/{battle.player2.hpAmount}
                    </Text>
                  </View>
                  <View className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-red-500"
                      style={{ width: `${(battle.player2.currentHP / battle.player2.hpAmount) * 100}%` }}
                    />
                  </View>
                </View>

                {/* Stats Grid */}
                <View className="gap-1">
                  <Text className="text-gray-200 text-xs">ATK: {battle.player2.atkAmount}</Text>
                  <Text className="text-gray-200 text-xs">DEF: {battle.player2.defAmount}</Text>
                  <Text className="text-gray-200 text-xs">CRT: {battle.player2.crtAmount}</Text>
                  <Text className="text-gray-200 text-xs">SPD: {battle.player2.spdAmount}</Text>
                  <Text className="text-gray-200 text-xs">INT: {battle.player2.intAmount}</Text>
                </View>
              </View>

              {/* Female Character */}
              <Image
                source={require("../../assets/images/female-character/female_4_cropped.png")}
                className="w-40 h-52"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Battle Log */}
          <View className="bg-black/70 rounded-2xl p-3 mb-3 max-h-32">
            <Text className="text-white font-bold mb-1 text-sm">Battle Log</Text>
            <ScrollView>
              {battle.battleLog.slice().reverse().map((log, index) => (
                <Text key={index} className="text-gray-300 text-xs mb-1">
                  <Text className="text-yellow-400">T{log.turn}:</Text>{" "}
                  <Text className={log.player === "player1" ? "text-blue-400" : "text-red-400"}>
                    {log.player === "player1" ? battle.player1.userId : battle.player2.userId}
                  </Text>{" "}
                  {log.action}
                  {log.damage ? ` (${log.damage} dmg)` : ""}
                </Text>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View className="gap-2">
            {isMyTurn ? (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleAttack}
                  className="flex-1 bg-red-600 rounded-lg py-3 border-2 border-red-400"
                >
                  <Text className="text-white text-center font-bold">⚔️ ATTACK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDefend}
                  className="flex-1 bg-blue-600 rounded-lg py-3 border-2 border-blue-400"
                >
                  <Text className="text-white text-center font-bold">🛡️ DEFEND</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSkill}
                  className="flex-1 bg-purple-600 rounded-lg py-3 border-2 border-purple-400"
                >
                  <Text className="text-white text-center font-bold">✨ SKILL</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-gray-700/80 rounded-lg py-3 border-2 border-gray-500">
                <Text className="text-gray-300 text-center font-bold">Waiting for opponent...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
