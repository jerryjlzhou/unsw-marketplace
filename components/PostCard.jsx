import { Video } from 'expo-av'
import { Image } from 'expo-image'
import moment from 'moment'
import { useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ImageView from 'react-native-image-viewing'
import RenderHTML from 'react-native-render-html'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import { getSupabaseFileUrl } from '../services/imageService'
import Avatar from './Avatar'

const textStyle = {
    color: theme.colors.text,
    fontSize: hp(1.75)
}

const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.text,
    },
    h4: {
        color: theme.colors.text,
    }
}
const SCREEN_WIDTH = Dimensions.get('window').width;

const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true
}) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }
    
    const openPostDetails = () => {

    }

    const createdAt = moment(item?.created_at).format('MMM D')
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
    const scrollRef = useRef(null);

    // Prepare images array for ImageView
    const imagesForViewer = item?.media?.filter(m => m.media_type === 'image').map(m => ({ uri: getSupabaseFileUrl(m.uri)?.uri })) || [];

    return (
        <View style={[styles.container, hasShadow && shadowStyles]}>
            <View style={styles.header}> 
                <View style={styles.userInfo}>
                    <Avatar 
                        size={hp(4.5)}
                        uri={item?.user?.image}
                        rounded={theme.radius.md}
                    />
                    <View style={{gap: 2}}>
                        <Text style={styles.username}>{item?.user?.name}</Text>
                        <Text style={styles.postTime}>{createdAt}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name="meatball" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Post body and Media */}
            <View style={styles.content}>
                <View style={styles.postBody}>
                    {
                        item?.body && (
                            <RenderHTML 
                                contentWidth={wp(100)}
                                source={{html: item?.body}} 
                            />
                        )
                    }
                </View>

                {/* Post Images and Videos Carousel */}
                {item?.media && item.media.length > 0 && (
                  <View style={{alignItems: 'center'}}>
                    <ScrollView
                      ref={scrollRef}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onScroll={e => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                        setCurrentIndex(index);
                      }}
                      scrollEventThrottle={16}
                      style={styles.postMedia}
                      contentContainerStyle={{alignItems: 'center'}}
                    >
                      {item.media
                        .sort((a, b) => a.sort_index - b.sort_index)
                        .map((media, idx) => {
                          const fileUrl = getSupabaseFileUrl(media.uri)?.uri;
                          // Find the index among images only for correct fullscreen
                          const imageIdx = item.media.filter(m => m.media_type === 'image').findIndex(m => m.id === media.id);
                          return media.media_type === "image" ? (
                            <TouchableOpacity key={media.id} activeOpacity={0.9} onPress={() => setFullscreenImageIndex(imageIdx)}>
                              <Image
                                source={{ uri: fileUrl }}
                                style={[styles.postMedia, {alignSelf: 'center'}]}
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          ) : (
                            <Video
                              key={media.id}
                              source={{ uri: fileUrl }}
                              style={[styles.postMedia, {alignSelf: 'center'}]}
                              useNativeControls
                              resizeMode="cover"
                              isLooping
                            />
                          );
                        })}
                    </ScrollView>
                    {/* Dot indicator BELOW the image carousel */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12, alignSelf: 'center' }}>
                      {item.media.map((_, idx) => (
                        <View
                          key={idx}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 4,
                            backgroundColor: currentIndex === idx ? theme.colors.text : theme.colors.gray,
                          }}
                        />
                      ))}
                    </View>
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
            </View>
        </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBotton: 15,
        borderRadius: theme.radius.xl*1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content: {
        gap: 10,

    },
    postMedia: {
        height: hp(40),
        width: wp(85),
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    postBody: {
        marginLeft: 5,
    }, 
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    }, 
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    }
})