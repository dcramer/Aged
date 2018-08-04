import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Sentry } from 'react-native-sentry';

import { db } from '../firebase';
import { colors } from '../styles';
import AlertCard from '../components/AlertCard';
import Card from '../components/Card';
import ModalHeader from '../components/ModalHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';

class SearchResults extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    query: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, error: null, items: [] };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    let { query } = this.props;
    this.setState({ loading: true });
    db.collection('distilleries')
      .where('name', '>=', query || '')
      .orderBy('name')
      .limit(25)
      .get()
      .then(snapshot => {
        this.setState({
          loading: false,
          items: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  _renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.onSelect(item)}>
      <Card>
        <Text style={styles.name}>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  );

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.searchContainer}>{this.renderChild()}</View>;
  }

  renderChild() {
    if (this.state.error) {
      return <Text>{this.state.error.message}</Text>;
    }

    if (this.state.loading && !this.state.items.length) {
      return <LoadingIndicator />;
    }

    return (
      <View>
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
        {!!this.props.query && (
          <AlertCard
            onPress={() => {
              this.props.navigation.navigate('AddDistillery');
            }}
            heading="Can't find a distillery?"
            subheading={`Tap here to add ${this.props.query}.`}
          />
        )}
      </View>
    );
  }
}

class DistillerySelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    this.state = { query: '' };
  }

  async componentWillMount() {
    let { navigation } = this.props;
    let { title, onChangeValue } = navigation.state.params;
    if (!title || !onChangeValue) navigation.goBack(null);
  }

  onSelect = value => {
    let { navigation } = this.props;
    navigation.state.params.onChangeValue(value);
    navigation.goBack();
  };

  render() {
    let { navigation } = this.props;
    let { title } = navigation.state.params;
    return (
      <View style={styles.container}>
        <ModalHeader title={title} />
        <View style={styles.search}>
          <SearchBar onChangeValue={query => this.setState({ query })} />
        </View>
        <SearchResults
          onSelect={this.onSelect}
          query={this.state.query}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  search: {
    backgroundColor: '#7b6be6',
  },
});

export default withNavigation(DistillerySelect);
