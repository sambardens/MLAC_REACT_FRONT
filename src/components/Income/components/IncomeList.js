import { Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import IncomeItem from './IncomeItem';
import TableTitle from './TableTitle';

const IncomeList = ({ currentIncomeList }) => {
	const { incomes } = useSelector(state => state.income);
	const { selectedBap, baps } = useSelector(state => state.user);

	const text =
		selectedBap?.bapName && selectedBap?.releases?.length > 0
			? "You don't have any income in this B.A.P."
			: selectedBap?.bapName && selectedBap?.releases?.length === 0
			? "You don't have any income in this B.A.P. Add a release to get started."
			: baps.length === 0
			? "You don't have any income yet. Get started by creating a B.A.P. [Band Artist or Project]"
			: "You don't have any income yet.";
	return (
		<Flex flexDir='column' justify='center' gap='12px' h='100%'>
			{currentIncomeList?.length > 0 && (
				<>
					<TableTitle key='title' />
					<Flex as='ul' flexDir='column' gap='8px'>
						{currentIncomeList.map(el => (
							<IncomeItem key={el.id} transaction={el} />
						))}
					</Flex>
				</>
			)}

			{incomes?.length === 0 && (
				<Text
					position={'absolute'}
					top='50%'
					right='50%'
					transform={'translate(50%, -50%)'}
					color='black'
					fontSize='18px'
					fontWeight='600'
					textAlign='center'
					w='100%'
				>
					{text}
				</Text>
			)}

			{incomes?.length > 0 && currentIncomeList?.length === 0 && (
				<Text
					position={'absolute'}
					top='50%'
					right='50%'
					transform={'translate(50%, -50%)'}
					color='black'
					fontSize='18px'
					fontWeight='600'
					textAlign='center'
				>
					No income for selected filters
				</Text>
			)}
		</Flex>
	);
};

export default IncomeList;
