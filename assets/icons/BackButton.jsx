import Svg, { Path } from 'react-native-svg';

const BackButtonIcon = ({ width = 24, height = 24, color = '#000', strokeWidth = 1.5, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <Path
      d="M4 6L4 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M8.00012 12.0005L20.0001 12.0005"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8C12 8 8.00001 10.946 8 12C7.99999 13.0541 12 16 12 16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackButtonIcon;