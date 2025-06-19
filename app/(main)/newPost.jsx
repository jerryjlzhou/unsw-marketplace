import { Video } from 'expo-av'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ImageView from 'react-native-image-viewing'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import Header from '../../components/Header'
import RichTextEditor from '../../components/RichTextEditor'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { getSupabaseFileUrl } from '../../services/imageService'
import { createOrUpdatePost } from '../../services/postService'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NewPost = () => {

    const {user} = useAuth();
    const bodyRef = useRef("");
    const editorRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]); // array of selected media
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);

    const onPick = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            selectionLimit: 10,
            allowsEditing: false,
            quality: 1,
        });

        console.log('file: ', result.assets[0]);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setFiles(result.assets);
            setCurrentIndex(0);
        }
    };

    const isLocalFile = file=>{
        if (!file) return null;
        if (typeof file == 'object') return true;

        return false;
    }

    const getFileType = file =>{
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.type;
        }
        // check image or video for remote file
        if (file.includes('postImages')) {
            return 'image';
        }

        return 'video';
    }

    const getFileUri = file=> {
        if (!file) return null;
        if(isLocalFile(file)) {
            return file.uri;
        }

        return getSupabaseFileUrl(file)?.uri;
    }

    const onSubmit = async ()=> {
        if (!bodyRef.current && !files) {
            Alert.alert('Post', "Please add media or text");
            return;
        }

        let data = {
            file: files, 
            body: bodyRef.current,
            userId: user?.id,
        }

        setLoading(true);
        let res = await createOrUpdatePost(data);
        setLoading(false);

        if (res.success) {
            setFiles([]);
            bodyRef.current = '';
            editorRef.current?.setContentHTML('');
            router.back();
        } else {
            Alert.alert('Post', res.msg);
        }
    }

    const removeFile = idx => {
        setFiles(files => {
            const newFiles = files.filter((_, i) => i !== idx);
            if (currentIndex >= newFiles.length) {
                setCurrentIndex(Math.max(0, newFiles.length - 1));
            }
            return newFiles;
        });
    };

    const onScroll = (e) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    };

    // Prepare images array for ImageView
    const imagesForViewer = files.filter(f => f.type === 'image').map(f => ({ uri: f.uri }));

    return (
        <ScreenWrapper bg="white">
            <View style={[styles.container, { marginBottom: hp(3) }]}> 
                <Header title="Create Post" />
                <ScrollView contentContainerStyle={{gap: 20}}>
                    {/* avatar */}
                    <View style={styles.header}>
                        <Avatar 
                            uri={user?.image}
                            size={hp(6.5)}
                            rounded={theme.radius.xl} 
                        />
                        <View style={{gap: 2}}>
                            <Text style={styles.username}>
                                {
                                    user && user.name
                                }
                            </Text>

                            <Text style={styles.publicText}>
                                Public
                            </Text>
                        </View>
                    </View>

                    <View style={styles.textEditor}>
                        <RichTextEditor editorRef={editorRef} onChange={body=> bodyRef.current = body}/>
                    </View>

                    {/* Show selected images/videos as a carousel */}
                    {files.length > 0 && (
                        <View style={styles.file}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={onScroll}
                                scrollEventThrottle={16}
                                style={{width: SCREEN_WIDTH, height: hp(30)}}
                            >
                                {files.map((file, idx) => (
                                    <View key={idx} style={[styles.file, {width: SCREEN_WIDTH, height: hp(30), position: 'relative'}]}>
                                        {file.type === 'video' ? (
                                            <Video 
                                                style={{flex: 1, borderRadius: theme.radius.xl}}
                                                source={{ uri: file.uri }}
                                                useNativeControls
                                                resizeMode="cover"
                                                isLooping
                                            />
                                        ) : (
                                            <Pressable style={{flex: 1}} onPress={() => setFullscreenImageIndex(files.filter(f => f.type === 'image').findIndex(f2 => f2.uri === file.uri))}>
                                                <Image source={{uri: file.uri}} contentFit='cover' style={{flex: 1, borderRadius: theme.radius.xl}} />
                                            </Pressable>
                                        )}
                                        <Pressable style={styles.closeIcon} onPress={() => removeFile(idx)}>
                                            <Icon name="delete" size={hp(2.7)} color="white"/>
                                        </Pressable>
                                    </View>
                                ))}
                            </ScrollView>
                            {/* Dot indicator */}
                            {files.length > 1 && (
                              <View style={{flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center'}}>
                                  {files.map((_, idx) => (
                                      <View
                                          key={idx}
                                          style={[styles.carousel, { backgroundColor: idx === currentIndex ? theme.colors.text : theme.colors.gray}]}
                                      />
                                  ))}
                              </View>
                            )}
                            {/* Fullscreen image modal with zoom and swipe to close */}
                            <ImageView
                                images={imagesForViewer}
                                imageIndex={fullscreenImageIndex ?? 0}
                                visible={fullscreenImageIndex !== null}
                                onRequestClose={() => setFullscreenImageIndex(null)}
                                swipeToCloseEnabled={true}
                                doubleTapToZoomEnabled={true}
                                presentationStyle="overFullScreen"
                            />
                        </View>
                    )}
                    
                    {/* Media picker button */}
                    <View style={{ alignItems: 'center', marginBottom: hp(2.2) }}>
                        <TouchableOpacity
                            onPress={onPick}
                            style={styles.addMedia}
                        >
                            <Icon name="album" size={hp(3.7)} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>


                <Button 
                    buttonStyle={{height: hp(6.2)}}
                    title="Post"
                    loading={loading}
                    hasShadow={false}
                    onPress={onSubmit}
                />
            </View>
        </ScreenWrapper>
    )
}

export default NewPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    username: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',

    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight,
    },
    textEditor: {

    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
    },
    addMedia: {
        backgroundColor: theme.colors.gray,
        borderRadius: 999,
        width: wp(13),
        height: wp(13),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.textLight,
        shadowOffset: { width: 0, height: hp(0.3) },
        shadowOpacity: 0.15,
        shadowRadius: hp(0.7),
        elevation: 4,
    },
    file: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderCurve: 'continuous',
    },
    closeIcon: {
        position: 'absolute',
        top: hp(1),
        right: wp(10),
        padding: 7,
        borderRadius: 50,

    },
    carousel: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    }
})