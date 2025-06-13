import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import Header from '../../components/Header'
import Input from '../../components/Input'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { getUserImageSrc } from '../../services/imageService'
import { updateUserData } from '../../services/userService'
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../services/imageService'


const EditProfile = () => {
    const {user: currentUser, setUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [user, setUser] = useState({
        name: '',
        image: null,
        bio: '',
        degree: '' 
    })

    useEffect(() => {
        if (currentUser) {
            setUser({
                name: currentUser.name || '',
                image: currentUser.image || null,
                bio: currentUser.bio || '',
                degree: currentUser.degree || '' 
            })
        }
    }, [currentUser])   

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser({...user, image: result.assets[0]});
        }
    }


    const onSubmit = async ()=> {
        let userData = {...user};
        let {name, image, bio, degree} = userData;
        if (!name || !degree) { // optionally update bio and image
            Alert.alert('Profile', "Name and degree fields cannot be empty!");
            return;
        }
        setLoading(true);

        if (typeof image == 'object') {
            let imageRes = await uploadFile('profiles', image?.uri, true);
            if (imageRes.success) userData.image = imageRes.data;
            else userData.image = null;
        }

        const res = await updateUserData(currentUser?.id, userData);
        setLoading(false);

        // Show a success message
        if (res.success) {
            setUserData({...currentUser, ...userData});
            router.back();
        }
    }

    let imageSource = user.image && typeof user.image == 'object' ? user.image.uri : getUserImageSrc(user.image);

  return (
    <ScreenWrapper bg="white">
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <Header title="Edit Profile" />

                { /* form */ }
                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image source={imageSource} style={styles.avatar}></Image>
                        <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                            <Icon name="camera" size={20} strokeWidth={2.5}></Icon>
                        </Pressable>
                    </View>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                        Please fill your profile details
                    </Text>
                    <Input 
                        icon={<Icon name="user"/>}
                        placeholder='Name'
                        value={user.name}
                        onChangeText={value => setUser({...user, name: value})}
                    />
                    <Input 
                        icon={<Icon name="hat"/>}
                        placeholder='Degree'
                        value={user.degree}
                        onChangeText={value => setUser({...user, degree: value})}
                    />
                    <Input 
                        placeholder='Enter your bio'
                        value={user.bio}
                        multiline={true}
                        containerStyle={styles.bio}
                        onChangeText={value => setUser({...user, bio: value})}
                    />

                    <Button title="Update" loading={loading} onPress={onSubmit}/>
                </View>
            </ScrollView>
        </View>


    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: 'center',
        borderColor: theme.colors.gray
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl*1.8,
        borderWidth: 1,
        borderColor: theme.colors.gray,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    form: {
        gap: 18,
        marginTop: 20,
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        padding: 17,
        paddingHorizontal: 20,
        gap: 15
    },
    bio: {
        flexDirection: 'row',
        height: hp(20),
        alignItems: 'flex-start',
        paddingVertical: 15
    }

    
})