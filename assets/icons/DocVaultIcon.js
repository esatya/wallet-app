import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgComponent = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={22.873} height={27} {...props}>
    <Path
      d="M3.216 0A3.147 3.147 0 0 0 0 3.037v20.926A3.147 3.147 0 0 0 3.216 27h16.44a3.147 3.147 0 0 0 3.216-3.037V9.788a.985.985 0 0 0-.314-.716l-.011-.011L13.267.3a1.105 1.105 0 0 0-.758-.3Zm0 2.025h8.22v5.738a3.147 3.147 0 0 0 3.217 3.037h6.076v13.163a1.028 1.028 0 0 1-1.072 1.012H3.216a1.028 1.028 0 0 1-1.072-1.012V3.037a1.028 1.028 0 0 1 1.072-1.012Zm10.365 1.432 5.632 5.318h-4.56a1.028 1.028 0 0 1-1.072-1.012Z"
      fill={props.color || '#141515'}
    />
  </Svg>
);

export default SvgComponent;
