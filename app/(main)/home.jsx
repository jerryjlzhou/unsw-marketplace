import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import Icon from '../../assets/icons'
import Avatar from '../../components/Avatar'
import Loading from '../../components/Loading'
import PostCard from '../../components/PostCard'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { supabase } from '../../lib/supabase'
import { fetchPosts } from '../../services/postService'

var limit = 0;
var PAGE_SIZE = 10;
const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(()=> {
    getPosts(1, true);
    // Subscribe to posts and post_media changes for real-time updates
    const postsSub = supabase
      .channel('realtime-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
        handlePostEvent(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_media' }, payload => {
        handlePostMediaEvent(payload);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(postsSub);
    };
  }, []);


  const handlePostEvent = (payload) => {
    const { eventType, new: newPost, old: oldPost } = payload;
    setPosts(prevPosts => {
      if (eventType === 'INSERT') {
        if (prevPosts.some(post => post.id === newPost.id)) return prevPosts;
        return [newPost, ...prevPosts];

      } else if (eventType === 'UPDATE') {
        return prevPosts.map(post => post.id === newPost.id ? { ...post, ...newPost } : post);

      } else if (eventType === 'DELETE') {
        return prevPosts.filter(post => post.id !== oldPost.id);
      }
      return prevPosts;
    });
  };

  const handlePostMediaEvent = (payload) => {
    const { eventType, new: newMedia, old: oldMedia } = payload;
    setPosts(prevPosts => {
      if (eventType === 'INSERT') {
        return prevPosts.map(post => {
          if (post.id === newMedia.post_id) {
            return {
              ...post,
              media: post.media ? [...post.media, newMedia] : [newMedia]
            };
          }
          return post;
        });

      } else if (eventType === 'UPDATE') {
        return prevPosts.map(post => {
          if (post.id === newMedia.post_id) {
            return {
              ...post,
              media: post.media ? post.media.map(m => m.id === newMedia.id ? { ...m, ...newMedia } : m) : [newMedia]
            };
          }
          return post;
        });

      } else if (eventType === 'DELETE') {
        return prevPosts.map(post => {
          if (post.id === oldMedia.post_id) {
            return {
              ...post,
              media: post.media ? post.media.filter(m => m.id !== oldMedia.id) : []
            };
          }
          return post;
        });
      }
      return prevPosts;
    });
  };

  const getPosts = async (pageNum = page, reset = false) => {
    if (loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) setHasMore(true);
    if (!reset) setLoadingMore(true);
    let res = await fetchPosts(PAGE_SIZE, pageNum);
    if (res.success) {
      if (reset) {
        setPosts(res.data);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...res.data.filter(post => !prev.some(p => p.id === post.id))]);
        setPage(pageNum + 1);
      }
      if (res.data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoadingMore(false);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts(1, true);
    setRefreshing(false);
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Uniplace</Text>
          <View style={styles.icons}>

            <Pressable onPress={()=> router.push('/notifications')}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>

            <Pressable onPress={()=> router.push('/newPost')}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>

            <Pressable onPress={()=> router.push('/profile')}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{borderWidth: 2}}
              />
            </Pressable>

          </View>
        </View>

        {/* Show posts */}
        <FlatList 
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listStyle]} 
          keyExtractor={item=> item.id.toString()}
          renderItem={({item})=> (
            <View style={{ marginBottom: 10 }}>
              <PostCard 
                item={item}
                currentUser={user}
                router={router}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[theme.colors.gray]} // Android
              tintColor={theme.colors.gray} // iOS
            />
          }
          onEndReached={() => {
            if (!loadingMore && hasMore) getPosts(page);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore || loadingMore ? (
              <View style={{marginVertical: posts.length==0 ? hp(40) : 30}}>
                <Loading />
              </View>
            ) : null
          }
        />
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(2),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  }

})