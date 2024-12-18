import { Checkbox } from '@chakra-ui/react';

import { useState } from 'react';

import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

const LyricArea = ({ lyrics, handleChange, explicit, setTrackInfo, handleEditTrackEveara }) => {
	const [isLyric, setIsLyric] = useState(false);
	const handleCheck = () => {
		setIsLyric(!isLyric);
	};
	return (
		<>
			<Checkbox
				id='has_lyrics'
				isChecked={isLyric}
				onChange={handleCheck}
				colorScheme='checkbox'
				iconColor='white'
				borderColor='accent'
				size='lg'
			>
				This song has lyrics
			</Checkbox>
			{isLyric && (
				<>
					<Checkbox
						id='explicit'
						name='explicit'
						isChecked={explicit}
						onChange={() => {
							setTrackInfo(prev => ({ ...prev, explicit: !prev.explicit }));
						}}
						onBlur={handleEditTrackEveara}
						colorScheme='checkbox'
						iconColor='white'
						borderColor='accent'
						size='lg'
					>
						Explicit
					</Checkbox>
					<CustomTextarea
						label='Lyric'
						placeholder='Enter lyric text'
						name='lyrics'
						value={lyrics}
						onChange={handleChange}
						onBlur={handleEditTrackEveara}
						maxW='500px'
					/>
				</>
			)}
		</>
	);
};

export default LyricArea;
