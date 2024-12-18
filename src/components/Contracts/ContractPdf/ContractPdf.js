import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { SplitCardPdf } from './SplitCardPdf';
import { TrackCardPdf } from './TrackCardPdf';

const styles = StyleSheet.create({
	container: {
		padding: 24,
		width: '100%',
	},
	fixedBox: {
		borderBottom: '2px solid #FF0151',
		paddingBottom: '18',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	imageBox: {
		width: '100',
		height: '56',
		marginLeft: 'auto',
	},

	header: {
		paddingBottom: 6,
	},
	title: {
		fontSize: 32,
		fontWeight: 600,
	},
	headerField: {
		flexDirection: 'row',
		marginTop: 12,
	},
	headerFieldTitle: {
		fontSize: 13,
		fontWeight: 400,
		marginRight: 18,
		color: '#282727',
		width: 75,
	},
	headerFieldText: {
		fontWeight: 400,
		fontSize: 12,
		color: '#909090',
	},
	listsContainer: {
		marginTop: 18,
		flexDirection: 'row',
	},

	splitsBox: {
		flexBasis: '45%',
		marginRight: 18,
	},
	boxTitle: {
		fontSize: 13,
		fontWeight: 500,
		marginBottom: 8,
	},
	tracksBox: {
		flexBasis: '55%',
	},
	list: {
		flexDirection: 'column',
		gap: 8,
	},
	pageNumber: {
		position: 'absolute',
		fontSize: 10,
		bottom: 20,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: 'gray',
	},
});

const Field = ({ title, text }) => (
	<View style={styles.headerField}>
		<Text style={styles.headerFieldTitle}>{title}</Text>
		<Text style={styles.headerFieldText}>{text}</Text>
	</View>
);

const ContractPdf = ({ bapName, date, writers, tracks, releaseName, type }) => {
	return (
		<Document>
			<Page size='A4' style={styles.container}>
				<View fixed={true} style={styles.fixedBox}>
					<View>
						<View style={styles.header}>
							<Text style={styles.title}>{type}</Text>
						</View>
						<Field title='Release' text={releaseName} />
						<Field title='Date' text={date} />
						<Field title='Artist' text={bapName} />
					</View>
					<View style={styles.imageBox}>
						<Image src='/assets/images/logo-primary.png' alt='Major Labl logo' />
					</View>
				</View>
				<View style={styles.listsContainer}>
					<View style={styles.splitsBox}>
						<Text style={styles.boxTitle}>Splits</Text>
						<View style={styles.list}>
							{writers?.map(user => (
								<SplitCardPdf key={`${user.email}splitcard`} user={user} />
							))}
						</View>
					</View>
					<View style={styles.tracksBox}>
						<Text style={styles.boxTitle}>Tracks</Text>
						<View style={styles.list}>
							{tracks?.map((track, i) => (
								<TrackCardPdf key={track.uniqueName} track={track} number={i + 1} />
							))}
						</View>
					</View>
				</View>

				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) => totalPages > 1 && `${pageNumber} / ${totalPages}`}
					fixed
				/>
			</Page>
		</Document>
	);
};

export default ContractPdf;
