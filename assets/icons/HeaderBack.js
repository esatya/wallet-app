import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={8} height={15} {...props}>
    <Path
      d="M7.5 15a.5.5 0 0 1-.353-.146l-7-7a.5.5 0 0 1 0-.707l7-7a.5.5 0 1 1 .707.707L1.207 7.5l6.647 6.647A.5.5 0 0 1 7.5 15Z"
      fill="#fff"
    />
  </Svg>
);

export default SvgComponent;
