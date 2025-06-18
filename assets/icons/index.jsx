import { theme } from '../../constants/theme'
import BackButtonIcon from './BackButton'
import CameraIcon from './Camera'
import EditIcon from './Edit'
import EyeOffIcon from './EyeOff'
import EyeOnIcon from './EyeOn'
import HatIcon from './Hat'
import HeartIcon from './Heart'
import HomeIcon from './Home'
import ImageIcon from './Image'
import LockIcon from './Lock'
import LogoutIcon from './Logout'
import MailIcon from './Mail'
import PlusIcon from './Plus'
import UserIcon from './User'
import VideoIcon from './Video'
import DeleteIcon from './Delete'
import AlbumIcon from './Album'
import CommentIcon from './Comment'
import ShareIcon from './Share'
import MeatballIcon from './Meatball'

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
    eyeon: EyeOnIcon,
    image: ImageIcon,
    video: VideoIcon,
    delete: DeleteIcon,
    album: AlbumIcon,
    comment: CommentIcon,
    share: ShareIcon,
    meatball: MeatballIcon
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