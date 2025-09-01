import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KnowledgeProvider } from "@/providers/KnowledgeProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#0a0f0a' }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="parser" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="export" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KnowledgeProvider>
          <RootLayoutNav />
        </KnowledgeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
