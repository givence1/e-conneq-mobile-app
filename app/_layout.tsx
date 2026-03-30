import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

import BootingScreen2 from "@/components/BootingScreen2";
import UpdateModal from "@/components/UpdateModal";
import { useAuthStore } from "@/store/authStore";
import { client } from "@/utils/graphql/client";
import { InterVersion } from "@/utils/schemas/interfaceGraphql";
import { getVersionStatus } from "@/utils/versionCheck";
import { ApolloProvider } from "@apollo/client";
import "../utils/i18n";



// 👇 Prevent the splash screen from auto-hiding until ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, role, token, isCheckingAuth, schoolIdentification } = useAuthStore();

  const [isLayoutReady, setLayoutReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
    // 🔥 Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const sortedVer = schoolIdentification?.version?.mobile?.sort((a: InterVersion, b: InterVersion) => a?.rank > b?.rank ? 1 : a?.rank < b?.rank ? -1 : 0)
  const status = getVersionStatus(sortedVer ? sortedVer[0] : null);
  console.log(status);

  // Step 1: Trigger auth check
  useEffect(() => {
    const boot = async () => {
      // ---- Authenticate user
      await checkAuth();

      // ---- Version Status ----
      if (status.expired || status.updateAvailable) {
        setShowUpdateModal(true);;
      } else {
        setShowUpdateModal(false);
      }

      setLayoutReady(true);
    };

    boot();
  }, []);
  // Step 2: Update layout readiness
  useEffect(() => {
    setLayoutReady(!isCheckingAuth);
  }, [isCheckingAuth]);

  // Step 3: Handle routing logic once layout and auth are ready
  useEffect(() => {
    if (!isLayoutReady) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      if (role === "admin") router.replace("/(auth)/select-campus");
      if (role === "teacher") router.replace("/(auth)/select-campus");
      if (role === "parent") router.replace("/(auth)/select-profile");
      if (role === "student") router.replace("/(auth)/select-profile");
    }

    SplashScreen.hideAsync();
  }, [user, token, segments, isLayoutReady]);

  // ✅ Step 4: Register the PWA service worker (Web Only)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "%c[PWA]",
              "color: #2D7A7A; font-weight: bold;",
              "Service Worker registered successfully:",
              registration.scope
            );
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  useEffect(() => {
  if (!isLayoutReady) return;

  const inAuthScreen = segments[0] === "(auth)";
  const isSignedIn = user && token;

  setTimeout(() => {
    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      if (role === "admin" || role === "teacher") {
        router.replace("/(auth)/select-campus");
      } else {
        router.replace("/(auth)/select-profile");
      }
    }
    SplashScreen.hideAsync();
  }, 0);
}, [user, token, segments, isLayoutReady]);


  if (!isLayoutReady) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          {/* <BootingScreen /> */}
                  <BootingScreen2 onFinished={() => setIntroDone(true)} />

        </SafeScreen>
      </SafeAreaProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <SafeScreen>

          
          {/* 🔥 Update Modal */}
          {showUpdateModal && (
            <UpdateModal
              visible={showUpdateModal}
              status={status}
              versionChanges={sortedVer ? sortedVer[0] : null}
              onClose={() => setShowUpdateModal(false)}
            />
          )}

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabstudent)" />
            <Stack.Screen name="(tabteacher)" />
            <Stack.Screen name="(tabparent)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}