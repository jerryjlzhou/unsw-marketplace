import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import { useRef, useState } from 'react'
import Button from '../components/Button'


const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async ()=>{
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert('Sign Up', "Please fill in all fields");
      return;
    }

    // check valid student email

    // good to go

  }

  return (
    <ScreenWrapper bg="white"> 
      <StatusBar style="dark"></StatusBar>
      <View style={styles.container}>
        <BackButton router={router}></BackButton>

        {/* welcome text */ }
        <View >
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>

        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{fontSize: hp(1.5), color: 'black'}}>
            Fill your details to create an account
          </Text>

          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
            placeholder='Enter your name'
            onChangeText={value=> nameRef.current = value}
          />

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder='Enter your student email'
            onChangeText={value=> emailRef.current = value}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={value=> passwordRef.current = value}
          />


          {/* log in button */}
          <Button title={'Sign Up'} loading={loading} onPress={onSubmit}></Button>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.push('login')}>
            <Text style={[styles.footerText, {color: theme.colors.yellowDark, fontWeight: theme.fonts.semibold}]}>
              Log in
            </Text>
          </Pressable>
        </View>


      </View>

        
    </ScreenWrapper>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: 'black',
  },
  form: {
    gap: 25
  },
  forgotPassword: {
    textAlign: 'right',
    // fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    fontSize: hp(1.4),
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.5)
  }
})
