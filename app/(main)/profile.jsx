import { Alert, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'


const Profile = () => {
    const {user, setAuth} = useAuth();
    const router = useRouter();

    const onLogout = async ()=> {
    const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign Out', "Error signing out");
        }

    }

    const handleLogout = () => {
        Alert.alert('Confirm', "Are you sure you want to log out?", [
            {
            text: 'Cancel',
            onPress: () => console.log('cancelled'),
            style: 'cancel'
            },
            {
            text: 'Log out',
            onPress: () => onLogout(),
            style: 'destructive'
            }
        ]);
    };

  return (
    <ScreenWrapper bg="white">
        <UserHeader user={user} router={router} handleLogout={handleLogout}/>
    </ScreenWrapper>
  )
}

const UserHeader = ({user, router, handleLogout}) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4)}}>
            <View>
                <Header title="Profile" showBackButton={true} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" color={theme.colors.rose} />

                </TouchableOpacity>
            </View>

        </View>
    )
}
export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    info: {
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight,
    },
    logoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2'
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30,
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text
    }



})