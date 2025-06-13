import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const Input = (props) => {
  // Dynamically set height for multiline inputs if containerStyle is not provided
  const isMultiline = !!props.multiline;
  const dynamicStyle = isMultiline && !props.containerStyle ? { minHeight: hp(28), alignItems: 'flex-start' } : {};
  return (
    <View style={[styles.container, props.containerStyle, dynamicStyle]}>
        {
            props.icon && props.icon
        }
        <TextInput
            style={{flex: 1, textAlignVertical: isMultiline ? 'top' : 'center'}}
            placeholderTextColor={theme.colors.textLight}
            ref={props.inputRef && props.inputRef}
            {...props}
         />
        {
            props.rightIcon && (
                <View style={{marginLeft: 8}}>{props.rightIcon}</View>
            )
        }
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        paddingHorizontal: 18,
        gap: 12,
    }
})