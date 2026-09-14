import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}>
      <Tabs.Screen name="index" options={{ title: 'Trips', tabBarIcon: ({ color, size }) => <Ionicons name="airplane-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: ({ color, size }) => <Ionicons name="information-circle-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
