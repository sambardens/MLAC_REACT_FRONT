import { Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import compareObjects from 'src/functions/utils/compareObjects';
import { handleEditTrack } from 'store/operations';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';

import LyricArea from './LyricArea';
import durationTypes from './durationTypes.json';

const DistributeTrack = ({ track, index }) => {
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const toast = useToast();
	const { user, selectedRelease } = useSelector(state => state.user);
	const { checkedTracks, type } = selectedRelease;
	const initialState = {
		evearaPreviewDuration: track.evearaPreviewDuration,
		evearaPreviewStartAt: track.evearaPreviewStartAt,
		lyrics: track.lyrics || '',
		explicit: track.explicit,
		// writers: [],
	};
	const [oldTrackInfo, setOldTrackInfo] = useState({ ...initialState });
	const [trackInfo, setTrackInfo] = useState({ ...initialState });
	const [durationError, setDurationError] = useState('');

	// const [writer, setWriter] = useState({ name: '', credits: [] });
	const trackDuration = track.duration ? Math.floor(track.duration / 1000) : 180;
	const handleChangeTrack = e => {
		const { name, value } = e.target;
		if (name !== 'evearaPreviewStartAt') {
			setTrackInfo(prev => ({ ...prev, [name]: value }));
		} else {
			const numberRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
			const isNumber = numberRegex.test(value);
			if (!isNumber) return;
			const numValue = Number(value);
			if (name === 'evearaPreviewStartAt') {
				const prevDuration = Number(trackInfo?.evearaPreviewDuration);
				const maxValue = trackDuration - prevDuration;
				const isValidPreviewStartAt = maxValue >= numValue;
				if (isValidPreviewStartAt) {
					setTrackInfo(prev => ({ ...prev, [name]: Number(value) }));
				} else {
					setTrackInfo(prev => ({ ...prev, [name]: maxValue }));
				}
			}
		}
	};

	const handleEditTrackEveara = () => {
		const isNewData = compareObjects(trackInfo, oldTrackInfo);
		if (isNewData) {
			dispatch(handleEditTrack({ track: { ...track, ...trackInfo }, trackData: trackInfo }));
			setOldTrackInfo(trackInfo);
		}
	};

	const handleSelect = ({ value }) => {
		const prevStartAt = Number(trackInfo?.evearaPreviewStartAt);
		const maxValue = trackDuration - prevStartAt;
		const isValidPreviewDuration = maxValue >= value;
		if (isValidPreviewDuration) {
			setTrackInfo(prev => ({ ...prev, evearaPreviewDuration: value }));
			setDurationError('');
		} else {
			const variants = [15, 30, 45, 60];
			let closestValue = variants[0];
			for (const variant of variants) {
				const difference = maxValue - variant;
				if (difference < 15) {
					closestValue = variant;
					break;
				}
			}
			setDurationError(
				`The maximum value you can select considering the track duration is ${closestValue}`,
			);
		}
	};

	const isTopCondition = () => {
		if (checkedTracks?.length === 1) {
			return true;
		} else if (checkedTracks?.length >= 2 && checkedTracks?.length === index + 1) {
			return true;
		} else {
			return false;
		}
	};
	return (
		<Flex
			gap='16px'
			px='24px'
			py='16px'
			flexDir='column'
			bg='bg.light'
			borderRadius='10px'
			maxW='500px'
			border='1px solid'
			borderColor='bg.secondary'
		>
			<Heading
				as='h4'
				fontWeight='500'
				fontSize='16px'
				color='black'
				pb='12px'
				px='12px'
				borderBottom='1px solid'
				borderColor='accent'
			>
				{track.position}. {track?.name}
			</Heading>
			<Flex justify='space-between'>
				<Text fontWeight='400' fontSize='16px' color='black'>
					ISRC code
				</Text>
				<Text fontWeight='400' fontSize='16px' color='secondary'>
					{track.isrc}
				</Text>
			</Flex>
			<LyricArea
				lyrics={trackInfo.lyrics}
				handleChange={handleChangeTrack}
				handleEditTrackEveara={handleEditTrackEveara}
				explicit={trackInfo.explicit}
				setTrackInfo={setTrackInfo}
			/>
			<CustomInput
				label='Preview start at'
				name='evearaPreviewStartAt'
				value={trackInfo.evearaPreviewStartAt}
				onChange={handleChangeTrack}
				onBlur={handleEditTrackEveara}
				placeholder='Enter preview start at'
				textRight='sec'
			/>
			<CustomSelect
				name='Preview_duration'
				label='Preview duration'
				options={durationTypes}
				value={trackInfo.evearaPreviewDuration}
				placeholder='Select preview duration'
				pxDropdownIcon='12px'
				onChange={handleSelect}
				isTop={isTopCondition()}
				errors={durationError}
				mtError={0}
				mlError='12px'
				textRight='sec'
				isErrorsAbsolute
				{...(checkedTracks?.length === index + 1 && { menuListTopHeight: '+ 20' })}
			/>
			{/* <Flex align='flex-end'>
						<CustomInput
							label='Credits'
							name='name'
							value={writer.name}
							onChange={e => {
								setWriter(prev => ({ ...prev, name: e.target.value }));
							}}
							onBlur={() => {}}
							placeholder='Enter writer name'
						/>
						<CustomSelect
							options={creditTypes}
							name='credits'
							value={writer.credits}
							placeholder='Select credit'
							selectedOptions={writer.credits}
							onChange={handleSelect}
							isMulti={true}
							ml='8px'
							isTop={selectedRelease.checkedTracks.length === index + 1 ? true : false}
							{...(selectedRelease.checkedTracks.length === index + 1 && { menuListTopHeight: '- 10' })}
						/>
					</Flex> */}
		</Flex>
	);
};

export default DistributeTrack;
