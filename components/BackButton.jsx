import { Pressable, StyleSheet } from 'react-native'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'
import { wp } from '../helpers/common'


const BackButton = ({size=26, router}) => {
  return (
    <Pressable onPress={()=> router.back()} style={styles.button}>
        <Icon name="backbutton" strokeWidth={2.5} size={size} color='black'></Icon>
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    marginHorizontal: wp(0),
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(211, 211, 210, 0.7)' 
  }
})