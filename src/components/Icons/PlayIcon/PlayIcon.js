import React from 'react';

const PlayIcon = ({ fill, color }) => {
	return (
		<svg width='40' height='40' viewBox='0 0 40 40' fill={fill}>
			<rect width='40' height='40' rx='20' />
			<g clipPath='url(#clip0_2219_22796)'>
				<path
					d='M15 12V28L28 20L15 12Z'
					fill={color}
					stroke={color}
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</g>
			<defs>
				<clipPath id='clip0_2219_22796'>
					<rect width='24' height='24' fill={color} transform='translate(8 8)' />
				</clipPath>
			</defs>
		</svg>
	);
};

export default PlayIcon;
