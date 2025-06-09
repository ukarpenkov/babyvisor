import * as React from 'react'
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg'
const CameraIcon = (props) => (
    <Svg
        width={36}
        height={36}
        fill="none"
        {...props}
    >
        <Rect
            width={24}
            height={18}
            x={6}
            y={15}
            stroke="currentColor"
            strokeWidth={3}
            rx={3}
        />
        <Ellipse
            cx={18}
            cy={24}
            fill="#fff"
            stroke="currentColor"
            strokeWidth={3}
            rx={7.5}
            ry={5.25}
        />
        <Circle cx={18} cy={24} r={3} fill="currentColor" />
        <Path
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={2.7}
            d="M18 7.5c3-4.5 6 1.5 0 6 6-4.5 9-10.5 0-6"
        />
    </Svg>
)
export default CameraIcon
