import { useRoute } from '@react-navigation/native';
import { Text, View } from 'react-native';

export default function DetailsIndex() {
	const route = useRoute();
	const { params } = route;

	// const { name } = props;
	console.log('PROPS ', params);
	return (
		<View>
			<Text>DetailsIndex Screen </Text>
		</View>
	);
}
