import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../assets/icons'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Input from '../components/Input'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import { supabase } from '../lib/supabase'

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ()=>{
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Login', "Please enter email and password");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    console.log('error: ', error);
    if (error) {
      Alert.alert('Login', error.message);
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
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>

        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{fontSize: hp(1.7), color: 'black'}}>
            Please log in to continue
          </Text>

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder='Enter your student email'
            onChangeText={value=> emailRef.current = value}
            autoCapitalize='none'
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>} 
            placeholder='Enter your password'
            secureTextEntry={!showPassword}
            onChangeText={value=> passwordRef.current = value}
            autoCapitalize='none'
            rightIcon={
              <Pressable onPress={() => setShowPassword(prev => !prev)}>
                <Icon name={showPassword ? "eyeon" : "eyeoff"} size={22} color={theme.colors.textLight} />
              </Pressable>
            }
          />

          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>

          {/* log in button */}
          <Button title={'Login'} loading={loading} onPress={onSubmit}></Button>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => router.push('signUp')}>
            <Text style={[styles.footerText, {color: theme.colors.yellowDark, fontWeight: theme.fonts.semibold}]}>
              Sign up
            </Text>
          </Pressable>
        </View>


      </View>

        
    </ScreenWrapper>
  )
}

export default Login

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
