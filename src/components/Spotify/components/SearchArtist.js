import { Flex, Text } from '@chakra-ui/react';

import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';

import SearchIcon from '../../../assets/icons/base/search.svg';

import ArtistCard from './ArtistCard';
import { poppins_400_16_24 } from '@/styles/fontStyles';

export const SearchArtist = ({
	searchValue,
	handleChange,
	searchArr,
	isLoading,
	setSelectedArtist,
	setIsArtistsList,
	closeModal,
}) => {
	return (
		<>
			<Text color={'textColor.description'} sx={poppins_400_16_24} mt={'24px'}>
				Please find yourself or your band in the list below.
			</Text>

			<CustomInput
				icon={SearchIcon}
				mr='10px'
				placeholder='Search'
				value={searchValue}
				onChange={handleChange}
				label={'Search'}
				mt={'24px'}
				mlLabel={'0px'}
				name='searchValue'
			/>

			{isLoading ? (
				<Flex alignItems={'center'} justifyContent={'center'} h='296px'>
					<MutatingDots
						height={'100'}
						width={'100'}
						color={'#db2754'}
						secondaryColor={'#db2754'}
						radius='12.5'
						ariaLabel='mutating-dots-loading'
						wrapperStyle={{}}
						wrapperClass=''
						visible={true}
					/>
				</Flex>
			) : (
				<>
					{searchArr?.length > 0 ? (
						<Flex
							flexDir={'column'}
							as={'ul'}
							mt={'8px'}
							maxH='288px'
							style={{ overflowY: 'overlay' }}
							pr={searchArr?.length > 5 ? '5px' : '0px'}
						>
							{searchArr.map(artist => (
								<Flex
									as={'li'}
									flexDir={'column'}
									justifyContent='center'
									h='96px'
									key={Math.random()}
									_hover={{ bg: 'bg.secondary', borderRadius: '10px' }}
								>
									<ArtistCard
										searchValue={searchValue}
										searchArrLength={searchArr?.length}
										isLoading={isLoading}
										artist={artist}
										isButton={true}
										setSelectedArtist={setSelectedArtist}
										closeArtistsList={() => {
											setIsArtistsList(false);
										}}
									/>
								</Flex>
							))}
						</Flex>
					) : (
						<Flex alignItems={'center'} justifyContent={'center'} h='296px'>
							<Text fontSize='16px' color='black'>
								No user with this email can be found. Send them an invitation to join Major Labl Artist Club
								for free. Once they have registered they will be able to sign this contract.
							</Text>
						</Flex>
					)}
				</>
			)}

			<Flex justifyContent={'end'}>
				<CustomButton onClickHandler={closeModal} mt='8px' styles={'light'} align-self='end'>
					Cancel
				</CustomButton>
			</Flex>
		</>
	);
};
