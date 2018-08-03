import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { addDistillery } from '../actions/distilleries';
import { colors, margins } from '../styles';
import TextField from '../components/forms/TextField';

class AddDistillery extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Distillery',
  };

  constructor(...args) {
    super(...args);
    this.state = {
      name: '',
      region: '',
      country: '',
    };
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    if (!this.isValid()) return;
    if (this.state.submitting) return;
    let state = this.state;
    let { auth, navigation } = this.props;
    this.setState({ error: null, submitting: true });
    console.warn({
      userAdded: auth.user.uid,
      name: state.name,
      region: state.region,
      country: state.country,
    });
    this.props
      .addDistillery({
        userAdded: auth.user.uid,
        name: state.name,
        region: state.region,
        country: state.country,
      })
      .then(distillery => {
        navigation.goBack(null);
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    let state = this.state;
    return state.name && state.country && state.region;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. Bowmore"
        />
        <TextField
          onChangeValue={v => this.onChangeValue('country', v)}
          name="Country"
          placeholder="e.g. Scotland"
        />
        <TextField
          onChangeValue={v => this.onChangeValue('region', v)}
          name="Region"
          placeholder="e.g. Highlands"
        />
        <Button
          title="Add Distillery"
          onPress={this.onSubmit}
          containerViewStyle={styles.buttonContainer}
          disabled={!this.isValid() || this.state.submitting}
          buttonStyle={styles.button}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: margins.full,
    marginBottom: margins.full,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { addDistillery }
)(AddDistillery);