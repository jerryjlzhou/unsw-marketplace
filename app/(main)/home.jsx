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
import { fetchPosts } from '../../services/postService'


var limit = 0;
const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> {
    getPosts();
  }, []);

  const getPosts = async ()=> {

    limit = limit + 10;
    let res = await fetchPosts(limit);
    console.log('got posts result', res);
    console.log('user: ', res.data[0].user);

    if (res.success) {
      setPosts(res.data);
    }

  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getPosts();
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
          ListFooterComponent={
            <View style={{marginVertical: posts.length==0 ? hp(40) : 30}}>
              <Loading />
            </View>
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