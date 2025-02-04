import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    marginTop: 60,
  },
  videoItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoWrapper: {
    position: 'absolute',
    left: -SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  searchWrapper: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  searchIconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    borderRadius: 25,
    margin: 10,
    zIndex: 3,
  },
  searchAnimatedContainer: {
    position: 'absolute',
    right: 60,
    width: SCREEN_WIDTH * 0.80,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 0,
    gap: 10,
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000000',
    marginLeft: 0,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 