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

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const degreeRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async ()=>{
    if (!emailRef.current || !passwordRef.current || !nameRef.current || !degreeRef.current) {
      Alert.alert('Sign Up', "Please fill in all fields");
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    let degree = degreeRef.current.trim();

    setLoading(true);

    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, degree } }
    });

    setLoading(false);

    if (error) {
      Alert.alert('Sign up', error.message);
    }


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
            autoCapitalize='none'
          />

          <Input
            icon={<Icon name="hat" size={26} strokeWidth={1.6}/>} 
            placeholder='Enter your degree'
            onChangeText={value=> degreeRef.current = value}
            autoCapitalize='words'
          />

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
                <Icon name={showPassword ? "eyeOn" : "eyeOff"} size={22} color={theme.colors.textLight} />
              </Pressable>
            }
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
