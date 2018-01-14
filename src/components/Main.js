import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	Modal,
	Picker,
	ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';

/*******************
 * this function formats and return list of current tasks
 ********************/
function FormTasks(props){
	// if a filter is enabled only desirable tasks will be rendered
	const taskList = props.tasks.filter((item)=>{
		if (props.filter === 'all')
			return item;
		return item.lvl === props.filter;
	}).map(function(item, index){
		const d = new Date();
		// this should mark belated tasks with red background
		const color = item.deadline && d.getTime()>item.deadline ? '#FF5C5C' : '#FFF';
		return <TouchableOpacity
			onPress={
				()=>{Actions.task({
					index: index
				})
				}
			}
			key={'taskKey:'+index}
			style={{
				borderWidth: 1,
				paddingHorizontal: 10,
				paddingVertical: 7.5,
				marginVertical: 2.5,
				marginHorizontal: 2,
				borderColor: '#e3e3e3',
				backgroundColor: color,
			}}
		>
			<Text>
				{item.title}
			</Text>
		</TouchableOpacity>
	});
	return (<ScrollView style={{flex: 2}}>{taskList}</ScrollView>)
}

class Main extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			tasks: {
				arr: []
			},
			// this parameter is required for controlling modal
			modalVisible: false,
			// this parameter will apply filter to tasks
			filter:'all'
		}
	}

	componentDidMount(){
		// get data from storage and create an element in storage if it is empty
		AsyncStorage.getItem('tasks').then((data)=>{
			if (data === null){
				AsyncStorage.setItem('tasks', JSON.stringify({arr: []}));
				const newEl = {
					arr: []
				};
				this.setState({
					tasks: newEl
				})
			}else{
				this.setState({
					tasks: JSON.parse(data)
				});
			}
		});
	}

	render(){
		return (
			<View style={styles.main}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>
						List of tasks
					</Text>
				</View>
				{
					this.state.tasks.arr.length == 0 ?
						<View
							style={{alignItems: 'center', flex: 2}}
						>
							<Text>
								Nothing to show
							</Text>
						</View> :
						<FormTasks tasks={this.state.tasks.arr} filter={this.state.filter} />
				}
				<View style={styles.footerContainer}>
					<TouchableOpacity
						onPress={()=>{
							Actions.newTask()
						}}
						style={styles.buttonWrapper}
					>
						<Text style={styles.buttonText}>
							New task
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={()=>{
							this.setState({modalVisible:true});
						}}
						style={styles.buttonWrapper}
					>
						<Text style={styles.buttonText}>
							Filter
						</Text>
					</TouchableOpacity>
				</View>
				<Modal
					visible={this.state.modalVisible}
					animationType={'slide'}
					onRequestClose={() => this.closeModal()}
				>
					<View style={styles.modalContainer}>
						<View style={{alignItems: 'center',}}>
							<Text style={styles.title}>Filter Tasks</Text>
						</View>
						<Picker
							selectedValue={this.state.filter}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({
									filter: itemValue
								});
							}}
						>
							<Picker.Item label="Unimportant" value={0} />
							<Picker.Item label="Important" value={1} />
							<Picker.Item label="Very Important" value={2} />
							<Picker.Item label="Show All" value={'all'} />
						</Picker>
						<View style={{alignItems: 'center',}}>
							<TouchableOpacity
								onPress={() => this.setState({modalVisible:false})}
								style={styles.buttonWrapper}
							>
								<Text style={styles.buttonText}>
									Apply Filter
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	title:{
		fontWeight: "900",
		fontSize: 20,
	},
	titleContainer: {
		flex: 0,
		padding: 10,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	footerContainer: {
		flex: 0,
		alignContent: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 5,
		backgroundColor: '#fff',
	},
	buttonText:{
		fontSize: 20,
		flex: 0,
		color: '#fff'
	},
	buttonWrapper:{
		borderRadius: 5,
		backgroundColor: '#1997c6',
		paddingHorizontal: 20,
		paddingVertical: 5,
	},
	main:{
		flex: 1,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
	}
});

export default Main