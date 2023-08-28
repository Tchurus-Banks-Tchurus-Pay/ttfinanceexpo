import { StyleSheet } from 'react-native';

import Icons from '@expo/vector-icons/Ionicons';
import PieChart from 'react-native-pie-chart';
import EditScreenInfo from '../../components/EditScreenInfo';
import TableEditor from '../../components/TableEditor';
import { Text, View } from '../../components/Themed';


export default function TabOneScreen() {

  
  const widthAndHeight = 250;
  const series = [60, 8, 9];
  const sliceColor = ['#40E2FF', '#55F786', '#CA89FF'];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          coverRadius={0.7}
          sliceColor={sliceColor}
        />
        <Icons name="settings" size={32} color="black" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <TableEditor/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
