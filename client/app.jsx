import React from 'react';
import axios from 'axios';
import {
	Container,
	Form,
	Header,
	Image,
	Table,
	Statistic,
	Segment,
	Loader,
	Dimmer,
	Flag,
	Reveal,
	Button,
	Label
} from 'semantic-ui-react';
import ChordsTable from './components/chords_table';
import NextChord from './components/next_chord';
import MySearch from './components/my_search';

const CHORD_TYPES = {
	NAME: 'NAME',
	TAB: 'TAB'
};

const LoaderExampleLoader = ({ loading }) => (
	<Segment inverted style={{ height: '200px' }}>
		<Dimmer active={loading} style={{ background: '#1b1c1d' }}>
			<Loader size="massive" />
		</Dimmer>

		<Image src="/assets/images/wireframe/short-paragraph.png" />
	</Segment>
);

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chords: undefined,
			structuredChords: undefined,
			loading: true,
			nextChord: undefined,
			currentChord: undefined,
			chordType: CHORD_TYPES.NAME
		};
	}

	componentWillMount() {
		axios.get('/chords').then(response => {
			this.setState({
				chords: response.data.chords,
				structuredChords: response.data.structured_chords,
				loading: false
			});
		});
	}

	fetchNextChord(currentChord) {
		this.setState({ loading: true, currentChord });
		axios
			.get('/next_chord', {
				params: { chord: currentChord, chord_type: this.state.chordType }
			})
			.then(response => {
				const { name, tab } = response.data;
				this.setState({
					loading: false,
					nextChord: { name, tab }
				});
			})
			.catch(error => {
				// show error
				this.setState({ loading: false });
			});
	}

	fetchNextChordAgain() {
		return {
			fromCurrent: () => this.fetchNextChord(this.state.currentChord),
			fromNext: () => this.fetchNextChord(this.state.nextChord.name)
		};
	}

	render() {
		const chordCount = this.state.chords
			? Object.keys(this.state.chords).length
			: '?';
		return (
			<Container inverted>
				<Segment attached="top">
					<Image centered size="small" src="/static/bossafy_logo.png" />

				</Segment>

				<Segment attached="bottom">
					<Statistic
						style={{
							display: 'flex',
							justifyContent: 'center'
						}}
						color="teal"
						value={chordCount}
						label="chords and counting"
						size="tiny"
					/>
				</Segment>
				{this.state.currentChord
					? <NextChord
							chord={this.state.nextChord || {}}
							currentChord={this.state.currentChord}
							fetchNextChordAgain={this.fetchNextChordAgain()}
						/>
					: null}

				<Segment>
					<MySearch
						chordDict={this.state.chords}
						chordType={this.state.chordType}
						value={this.state.currentChord}
						fetchNextChord={currentChord => this.fetchNextChord(currentChord)}
					/>
					<Label as='a' basic pointing>Pick a Chord</Label>
				</Segment>

				<label> Need help picking a chord to start with ?</label>
				<ChordsTable
					chords={this.state.structuredChords || {}}
					chordDict={this.state.chords || {}}
					fetchNextChord={currentChord => this.fetchNextChord(currentChord)}
				/>
				{/* {this.state.loading
					? <LoaderExampleLoader loading={this.state.loading} />
					: null} */}
			</Container>
		);
	}
}

export default App;
