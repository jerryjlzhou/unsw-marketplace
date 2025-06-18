import Svg, { Path } from 'react-native-svg';

const MeatballIcon = ({ width = 24, height = 24, color = '#000', strokeWidth = 1.5, ...props }) => (
  <Svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <Path
      d="M11.9959 12H12.0049"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.9998 12H18.0088"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.99981 12H6.00879"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MeatballIcon;