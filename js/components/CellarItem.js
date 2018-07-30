import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';

import AgedPropTypes from '../propTypes';

export default class CellarItem extends Component {
  static propTypes = {
    item: AgedPropTypes.CellarItem.isRequired,
  };

  _onEditItem = () => {
    let id = this.props.item.id;
    this.props.navigation.navigate('EditCellarItem', { id: id });
  };

  render() {
    let { item } = this.props;
    return (
      <TouchableOpacity onPress={this._onEditItem}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="contain" />
          <View style={styles.rowText}>
            <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
              {item.name}
            </Text>
            <Text style={styles.distillery} numberOfLines={1} ellipsizeMode={'tail'}>
              {item.distillery}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 100,
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#CCC',
    shadowOpacity: 1.0,
    shadowRadius: 1,
  },
  name: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  distillery: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
  thumbnail: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  rowText: {
    flex: 4,
    flexDirection: 'column',
  },
});
