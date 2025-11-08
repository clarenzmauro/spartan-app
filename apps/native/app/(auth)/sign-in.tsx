import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser, useClerk, useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Track domain validation status
  const [isDomainValid, setIsDomainValid] = React.useState<boolean | null>(
    null
  );
  const [isValidating, setIsValidating] = React.useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = React.useState(false);

  // Validate email domain after sign in
  React.useEffect(() => {
    if (isSignedIn && isUserLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      const userEmail = user.emailAddresses[0].emailAddress;
      const isValid = userEmail.endsWith("@g.batstate-u.edu.ph");

      setIsDomainValid(isValid);
      setIsValidating(false);

      if (isValid) {
        // Valid domain - navigate to home immediately
        router.replace("/");
      } else {
        // Invalid domain - sign out immediately and show error
        signOut();
        alert(
          "Access restricted to Batangas State University accounts (@g.batstate-u.edu.ph) only."
        );
      }
    } else if (isSignedIn && !isUserLoaded) {
      // User is signed in but data is still loading
      setIsValidating(true);
    } else if (!isSignedIn) {
      // Reset validation state when signed out
      setIsDomainValid(null);
      setIsValidating(false);
    }
  }, [isSignedIn, isUserLoaded, user, signOut, router]);

  const handleSignIn = React.useCallback(
    async (event?: unknown) => {
      try {
        setIsOAuthLoading(true);

        const { createdSessionId, setActive } = await startOAuthFlow({
          redirectUrl: Linking.createURL("/", { scheme: "mybettertapp" }),
        });

        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
        }
      } catch (err) {
        console.error("OAuth error:", JSON.stringify(err, null, 2));
        alert("Sign-in failed. Check logs for details.");
      } finally {
        setIsOAuthLoading(false);
      }
    },
    [startOAuthFlow]
  );

  // Show loading state during validation
  if (isValidating) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign in</Text>
        <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
          Verifying account...
        </Text>
        <View
          style={{
            backgroundColor: "#f5f5f5",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#666", fontSize: 14, textAlign: "center" }}>
            Checking email domain access
          </Text>
        </View>
      </View>
    );
  }


  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* red rectangle with rounded corners */}
      <View
        style={{
          width: "100%",
          height: "75%",
          borderRadius: 32,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: "#b30000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* bsu logo */}
        <Image
          source={require("../../assets/images/auth-screen/batangas-state-university-logo.png")}
          style={{
            width: 200,
            height: "25%",
            resizeMode: "contain",
          }}
        />

        {/* welcome greeting */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Welcome, Spartans!
        </Text>
      </View>

      {/* Sign in with Google button */}
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isOAuthLoading}
        style={{
          backgroundColor: "#FFF",
          borderWidth: 1,
          borderColor: "#DADCE0",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 4,
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
          justifyContent: "center",
          marginTop: 20,
          opacity: isOAuthLoading ? 0.7 : 1,
        }}
      >
        <Image
          source={require("../../assets/images/google.png")}
          style={{
            width: 20,
            height: 20,
            marginRight: 12,
            resizeMode: "contain",
          }}
        />
        <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
          {isOAuthLoading ? "Signing in..." : "Sign in with Google"}
        </Text>
      </TouchableOpacity>

      {/* Domain restriction note */}
      <Text
        style={{
          color: "#6B7280",
          fontSize: 12,
          textAlign: "center",
          marginTop: 16,
          lineHeight: 16,
          maxWidth: "80%",
        }}
      >
        Exclusive app for students with @g.batstate-u.edu.ph email address
      </Text>
    </View>
  );
}
