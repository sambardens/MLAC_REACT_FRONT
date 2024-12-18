import { CustomSwitch } from '@/components/customSwitch/CustomSwitch';
import { ListItem, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import sortByDate from 'src/functions/utils/sort/sortByDate';
import sortByEmail from 'src/functions/utils/sort/sortByEmail';
import sortByLastName from 'src/functions/utils/sort/sortByLastName';

export const SortedComponent = ({ setFilteredUsers, filteredUsers, mailList }) => {
	const initialSortedState = { byLastName: false, byEmail: false, byDate: false };
	const [sorted, setSorted] = useState(initialSortedState);

	const sortUsers = (sortedKey, sortingFunction) => {
		if (!sorted[sortedKey]) {
			setFilteredUsers(sortingFunction(filteredUsers));
			setSorted({ ...initialSortedState, [sortedKey]: true });
		} else {
			setFilteredUsers(mailList);
			setSorted(initialSortedState);
		}
	};

	const onSortByDateHandler = () => {
		sortUsers('byDate', sortByDate);
	};

	const onSortByEmailHandler = () => {
		sortUsers('byEmail', sortByEmail);
	};

	const onSortByLastNameHandler = () => {
		sortUsers('byLastName', sortByLastName);
	};

	const switchArray = [
		{
			title: 'Sort by name',
			id: 'sort-by-name',
			isChecked: sorted.byLastName,
			onChange: onSortByLastNameHandler,
		},
		{
			title: 'Sort by email',
			id: 'sort-by-email',
			isChecked: sorted.byEmail,
			onChange: onSortByEmailHandler,
		},
		{
			title: 'Sort by date',
			id: 'sort-by-date',
			isChecked: sorted.byDate,
			onChange: onSortByDateHandler,
		},
	];

	return (
		<UnorderedList m={0} display={'flex'} alignItems={'center'} gap={'10px'}>
			{switchArray?.map(item => {
				return (
					<ListItem listStyleType={'none'} key={item.id}>
						<CustomSwitch
							onChange={item.onChange}
							title={item.title}
							id={item.id}
							isChecked={item.isChecked}
						/>
					</ListItem>
				);
			})}
		</UnorderedList>
	);
};
