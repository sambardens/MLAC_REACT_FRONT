import { poppins_600_18_27 } from '@/styles/fontStyles';
import { Box, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF0151', '#040629', '#4F759A', '#6D8A96', '#EEE'];

export const RadiusChart = ({ data, title = false }) => {
	return (
		<Box
			position={'relative'}
			width={'100%'}
			height={'100%'}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<Text
				sx={poppins_600_18_27}
				color={'textColor.blue'}
				position={'absolute'}
				top={'50%'}
				left={'47%'}
				transform={'translate(-50%, -50%)'}
			>
				{title}
			</Text>
			<ResponsiveContainer width='100%' height='100%'>
				<PieChart>
					<Pie
						data={data}
						cx={'45%'}
						cy={'50%'}
						innerRadius={65}
						outerRadius={80}
						fill='#8884d8'
						dataKey='percentage'
					>
						{data?.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
								// stroke={COLORS[index % COLORS.length]}
								// strokeWidth={
								// 	index === 0
								// 		? '8px'
								// 		: index === 1
								// 		? '6px'
								// 		: index === 2
								// 		? '4px'
								// 		: index === 3
								// 		? '2px'
								// 		: '0px'
								// }
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
};
