import { View, Text, Button } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';

const index = () => {
    const router = useRouter();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>  
      <Loading />
    </View>
  )
}

export default index