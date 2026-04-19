import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0422,
  longitudeDelta: 0.0421,
};

const Home = () => {
  const [query, setQuery] = useState('');

  const region = useMemo(() => DEFAULT_REGION, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      />

      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search parking spots"
          placeholderTextColor="#6b7280"
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export default Home;
