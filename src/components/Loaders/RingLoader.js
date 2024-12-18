import { ColorRing } from 'react-loader-spinner';

const RingLoader = ({ w = '80px', h = '80px' }) => {
	return (
		<ColorRing
			visible={true}
			height={h}
			width={w}
			ariaLabel='blocks-loading'
			wrapperStyle={{}}
			wrapperClass='blocks-wrapper'
			colors={['#909090', '#909090', '#909090', '#909090', '#909090']}
		/>
	);
};

export default RingLoader;
