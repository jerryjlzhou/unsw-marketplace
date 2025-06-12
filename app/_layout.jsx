import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { getUserData } from '../services/userService'

const _layout = () =>{
  return(
    <AuthProvider>
      <Mainlayout />
    </AuthProvider>
  )
}
const Mainlayout = () => {
  const {setAuth, setUserData} = useAuth();
  const router = useRouter();
  useEffect(()=>{

      supabase.auth.onAuthStateChange((_event, session) => {

        if (session) {
          setAuth(session?.user);
          updateUserData(session?.user);
          router.replace('/home');
        } else {
          setAuth(null);
          router.replace('/welcome');
        }
    })
  }, [])

    const updateUserData = async (user)=> {
      let res = await getUserData(user?.id);
      if (res.success) setUserData(res.data);
    }

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  )
}

export default _layout