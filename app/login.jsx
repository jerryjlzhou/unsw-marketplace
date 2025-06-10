import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import HomeIcon from '../assets/icons/Home'


const login = () => {
  return (
    <ScreenWrapper> 
        <Text>Login</Text>
        <HomeIcon strokeWidth={2}></HomeIcon>
    </ScreenWrapper>
  )
}

export default login

const styles = StyleSheet.create({})