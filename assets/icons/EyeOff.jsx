import Svg, { Path } from 'react-native-svg';

const EyeOffIcon = ({ width = 24, height = 24, color = '#000', strokeWidth = 1.5, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <Path d="M22 8C22 8 18 14 12 14C6 14 2 8 2 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M15 13.5L16.5 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 11L22 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 13L4 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 13.5L7.5 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default EyeOffIcon;