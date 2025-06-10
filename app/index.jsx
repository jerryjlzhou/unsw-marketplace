import { View, Text, Button } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';

const index = () => {
    const router = useRouter();

  return (
    <ScreenWrapper>
      <Text>hi poopie pie</Text>
      <Button title="Welcome" onPress={() => router.push('welcome')} />
    </ScreenWrapper>
  )
}

export default index