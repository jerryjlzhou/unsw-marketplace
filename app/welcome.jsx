import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import ScreenWrapper from '../components/ScreenWrapper'
import { hp, wp } from '../helpers/common'
import { Image } from 'expo-image'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter();

  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark"></StatusBar> 
        <View style={styles.container}>
            { /* welcome image */ }
            <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/Uniplace-logo.png')}></Image>

            { /* title */ }
            <View style={{gap: 20}}>
                <Text style={styles.title}>Uniplace</Text>
                <Text style={styles.punchline}>
                    Designed by students, for students
                </Text>
            </View>

            { /* footer */ }
            <View style={styles.footer}>
                <Button 
                    title="Get Started"
                    buttonStyle={{marginHorizontal: wp(3)}}
                    onPress={() => router.push('signUp')}
                />

                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>
                    <Pressable onPress={() => router.push(`login`)}>
                        <Text style={[styles.loginText, {color: theme.colors.yellowDark, fontWeight: theme.fonts.semibold}]}>
                            Log in
                        </Text>
                    </Pressable>
                </View>

            </View>

        </View>

    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4) 
    },

    welcomeImage: {
        height: hp(30), // Increased from hp(30) to hp(40)
        width: wp(300), // Increased from wp(300) to wp(340)
        alignSelf: 'center',
        borderRadius: 12,
        marginTop: hp(14)
    },

    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extrabold

    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(4),
        fontSize: hp(1.7),
        color: theme.colors.text
    },
    footer: {
        gap: 30,
        width: '100%'
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})