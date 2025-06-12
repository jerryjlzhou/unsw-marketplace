import { StyleSheet } from 'react-native'
import { theme } from '../../constants/theme'
import HomeIcon from './Home'
import BackButtonIcon from './BackButton'
import MailIcon from './Mail'
import LockIcon from './Lock'
import UserIcon from './User'
import HeartIcon from './Heart'
import PlusIcon from './Plus'
import LogoutIcon
 from './Logout'
const icons = {
    home: HomeIcon,
    backbutton: BackButtonIcon,
    mail: MailIcon,
    lock: LockIcon,
    user: UserIcon,
    heart: HeartIcon,
    plus: PlusIcon,
    logout: LogoutIcon,
}

const Icon = ({ name, size = 24, 
                strokeWidth = 1.9, 
                color = theme.colors.textLight, 
                ...props }) => {

    const IconComponent = icons[name];
    if (!IconComponent) return null;
    return (
        <IconComponent
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            color={color}
            {...props}
        />
    );
}

export default Icon;