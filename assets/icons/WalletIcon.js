import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={18.654} height={18} {...props}>
    <Path
      d="M17.239 18H1.429C.481 18 0 17.425 0 16.274V1.744A1.618 1.618 0 0 1 1.458 0H16.1a1.63 1.63 0 0 1 1.458 1.744v.521c.729 0 1.094.593 1.094 1.726v12.265c.016 1.151-.465 1.744-1.413 1.744ZM1.094 3.309a.267.267 0 0 0-.248.27v12.677c0 .45 0 .683.569.683h15.81c.569 0 .569-.234.569-.683v-3.615h-3.7a2 2 0 0 1-1.546-.791 3.131 3.131 0 0 1-.642-1.924 2.5 2.5 0 0 1 2.188-2.715h3.719V3.992c0-.683-.088-.683-.248-.683Zm13 4.945a1.537 1.537 0 0 0-1.342 1.672 1.946 1.946 0 0 0 .394 1.187 1.223 1.223 0 0 0 .948.486h3.719V8.254ZM1.458 1.043a.67.67 0 0 0-.613.7V2.3a1.054 1.054 0 0 1 .248-.036h15.636v-.521a.658.658 0 0 0-.613-.7Zm12.732 10a1.158 1.158 0 0 0 0-2.266 1.158 1.158 0 0 0 0 2.266Z"
      fill="#fff"
    />
  </Svg>
)

export default SvgComponent
