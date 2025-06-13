import { theme } from '../../constants/theme'
import BackButtonIcon from './BackButton'
import CameraIcon from './Camera'
import EditIcon from './Edit'
import EyeOffIcon from './EyeOff'
import EyeOnIcon from './EyeOn'
import HatIcon from './Hat'
import HeartIcon from './Heart'
import HomeIcon from './Home'
import LockIcon from './Lock'
import LogoutIcon from './Logout'
import MailIcon from './Mail'
import PlusIcon from './Plus'
import UserIcon from './User'

const icons = {
    home: HomeIcon,
    backbutton: BackButtonIcon,
    mail: MailIcon,
    lock: LockIcon,
    user: UserIcon,
    heart: HeartIcon,
    plus: PlusIcon,
    logout: LogoutIcon,
    edit: EditIcon,
    camera: CameraIcon,
    hat: HatIcon,
    eyeoff: EyeOffIcon,
    eyeon: EyeOnIcon

}

const Icon = ({ name, size = 24, 
                strokeWidth = 1.9, 
                color = theme.colors.textLight, 
                ...props }) => {

    const IconComponent = icons[name && name.toLowerCase()];
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