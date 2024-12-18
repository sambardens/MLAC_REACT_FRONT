import { Box } from '@chakra-ui/react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

export const BarsChart = ({ data, sizeBar = 35 }) => {
	const COLORS = ['#FF0151', '#040629', '#4F759A', '#6D8A96', '#EEE'];

	return (
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart data={data}>
				<Bar dataKey='percentage' barSize={sizeBar}>
					{data?.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};
