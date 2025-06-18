import { Alert, Button, StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'


var limit = 0;
const Home = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

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
          contentContainerStyle={styles.listStyle}
          keyExtractor={item=> item.id.toString()}
          renderItem={({item})=> <PostCard 
            item={item}
            currentUser={user}
            router={router}
            />
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
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  }

})