import React, { useState, useRef, useCallback, memo } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
}

const ImageGalleryComponent: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const modalFlatListRef = useRef<FlatList>(null);
  const scale = useSharedValue(1);

  // Memoize handlers to prevent recreating functions on each render
  const handleScroll = useCallback((event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  const openModal = useCallback((index: number) => {
    setModalIndex(index);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    scale.value = 1;
  }, []);

  const goToPrevious = useCallback(() => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  }, [activeIndex]);

  const goToNext = useCallback(() => {
    if (activeIndex < images.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  }, [activeIndex, images.length]);

  const modalGoToPrevious = useCallback(() => {
    if (modalIndex > 0) {
      setModalIndex(modalIndex - 1);
      modalFlatListRef.current?.scrollToIndex({
        index: modalIndex - 1,
        animated: true,
      });
    }
  }, [modalIndex]);

  const modalGoToNext = useCallback(() => {
    if (modalIndex < images.length - 1) {
      setModalIndex(modalIndex + 1);
      modalFlatListRef.current?.scrollToIndex({
        index: modalIndex + 1,
        animated: true,
      });
    }
  }, [modalIndex, images.length]);

  // Use Reanimated 2's gesture handler for better performance
  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1, { damping: 15 });
    },
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  // Memoize render functions to prevent recreating on each render
  const renderItem = useCallback(({ item, index }) => (
    <TouchableOpacity 
      style={styles.imageContainer} 
      onPress={() => openModal(index)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item }} 
        style={styles.image} 
        // Add caching for better performance
        cachePolicy="memory-disk"
      />
    </TouchableOpacity>
  ), [openModal]);

  const renderModalItem = useCallback(({ item }) => (
    <PinchGestureHandler
      onGestureEvent={pinchHandler}
    >
      <Animated.View style={styles.modalImageContainer}>
        <Animated.Image 
          source={{ uri: item }} 
          style={[
            styles.modalImage,
            animatedImageStyle
          ]} 
          resizeMode="contain"
          // Add caching for better performance
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </PinchGestureHandler>
  ), [pinchHandler, animatedImageStyle]);

  // Memoize keyExtractors
  const keyExtractor = useCallback((_, index) => `gallery-${index}`, []);
  const modalKeyExtractor = useCallback((_, index) => `modal-${index}`, []);

  // Optimize layout calculation
  const getItemLayout = useCallback((_, index) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
      
      {images.length > 1 && (
        <>
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={[styles.navButton, styles.prevButton, activeIndex === 0 && styles.disabledButton]}
            onPress={goToPrevious}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, activeIndex === images.length - 1 && styles.disabledButton]}
            onPress={goToNext}
            disabled={activeIndex === images.length - 1}
          >
            <ChevronRight size={24} color="#ffffff" />
          </TouchableOpacity>
        </>
      )}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <FlatList
            ref={modalFlatListRef}
            data={images}
            renderItem={renderModalItem}
            keyExtractor={modalKeyExtractor}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={modalIndex}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
          />
          
          {images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.modalNavButton, styles.modalPrevButton, modalIndex === 0 && styles.disabledButton]}
                onPress={modalGoToPrevious}
                disabled={modalIndex === 0}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <ChevronLeft size={30} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalNavButton, styles.modalNextButton, modalIndex === images.length - 1 && styles.disabledButton]}
                onPress={modalGoToNext}
                disabled={modalIndex === images.length - 1}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <ChevronRight size={30} color="#ffffff" />
              </TouchableOpacity>
              
              <View style={styles.modalPagination}>
                {images.map((_, index) => (
                  <View
                    key={`modal-dot-${index}`}
                    style={[
                      styles.modalPaginationDot,
                      index === modalIndex && styles.modalPaginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalImageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: height * 0.8,
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
  },
  modalPrevButton: {
    left: 16,
  },
  modalNextButton: {
    right: 16,
  },
  modalPagination: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPaginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  modalPaginationDotActive: {
    backgroundColor: '#ffffff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

// Memoize the component to prevent unnecessary re-renders
export const ImageGallery = memo(ImageGalleryComponent);