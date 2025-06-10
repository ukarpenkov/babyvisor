import * as React from 'react'
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg'
const CameraIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={55.56}
        height={55.56}
        fill="none"
        stroke="#000"
        {...props}
    >
        <Path
            strokeLinecap="round"
            strokeWidth={4}
            d="M27.78 22.22c0-5.55 5.55-8.33 0-13.89-5.56 5.56 0 8.34 0 2.78"
        />
        <Rect
            width={33.33}
            height={22.22}
            x={11.11}
            y={22.22}
            strokeWidth={4}
            rx={4.44}
            ry={4.44}
        />
        <Ellipse cx={27.78} cy={33.33} strokeWidth={3} rx={10} ry={6.67} />
        <Circle cx={27.78} cy={33.33} r={3.33} strokeWidth={3} />
    </Svg>
)
export default CameraIcon
