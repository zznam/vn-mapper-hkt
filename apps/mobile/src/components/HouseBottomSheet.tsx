import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Text, Image, View, TouchableOpacity, Alert } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { IHouse } from '../../../../packages/core/src/mock-data';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HouseBottomSheetRef {
  present: (house: IHouse) => void;
  dismiss: () => void;
}

interface Props {
  ref?: React.Ref<HouseBottomSheetRef>;
  onStartNavigation: (house: IHouse) => void;
  onToggleBookmark: (house: IHouse) => void;
}

// ── Handlers (module-level, no inline closures) ───────────────────────────────

const showReportAlert = () => {
  Alert.alert('Báo cáo lỗi', 'Đã ghi nhận phản hồi về địa chỉ này. Cảm ơn đóng góp của bạn!');
};

// ── Component ─────────────────────────────────────────────────────────────────

export const HouseBottomSheet = ({ ref, onStartNavigation, onToggleBookmark }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [house, setHouse] = useState<IHouse | null>(null);
  const [imageError, setImageError] = useState(false);

  useImperativeHandle(ref, () => ({
    present: (h: IHouse) => {
      setHouse(h);
      setImageError(false);
      bottomSheetRef.current?.expand();
    },
    dismiss: () => {
      bottomSheetRef.current?.close();
      setTimeout(() => setHouse(null), 300);
    },
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  const handleBookmarkToggle = useCallback(() => {
    if (!house) return;
    const updatedHouse: IHouse = { ...house, isBookmarked: !house.isBookmarked };
    setHouse(updatedHouse);
    onToggleBookmark(updatedHouse);
  }, [house, onToggleBookmark]);

  const handleStartNav = useCallback(() => {
    if (!house) return;
    onStartNavigation(house);
    bottomSheetRef.current?.close();
  }, [house, onStartNavigation]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['50%', '90%']}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView className="flex-1 px-5 pt-2">
        {house && (
          <View className="pb-10">
            {/* Header Facade Image */}
            {imageError ? (
              <View className="w-full h-52 rounded-2xl bg-gray-100 items-center justify-center">
                <Text className="text-4xl mb-2">🏠</Text>
                <Text className="text-gray-400 text-sm">Không tải được ảnh</Text>
              </View>
            ) : (
              <Image
                source={{ uri: house.imageUrl }}
                className="w-full h-52 rounded-2xl bg-gray-200"
                resizeMode="cover"
                onError={handleImageError}
                accessibilityLabel={`Ảnh mặt tiền ${house.address}`}
              />
            )}

            {/* Title & Address */}
            <Text className="mt-5 text-2xl font-extrabold text-gray-900 leading-tight">
              {house.address}
            </Text>

            {/* Tag Badges */}
            {house.tags && house.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {house.tags.map((tag, idx) => (
                  <View
                    key={idx}
                    className="bg-blue-50/80 px-3 py-1.5 rounded-full border border-blue-100"
                    accessibilityLabel={tag}
                  >
                    <Text className="text-blue-600 text-xs font-bold">{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Details Description */}
            {house.details && (
              <Text className="mt-4 text-base text-gray-600 leading-relaxed font-normal bg-gray-50 p-4 rounded-xl border border-gray-100">
                📝 {house.details}
              </Text>
            )}

            {/* Action Buttons Row */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={handleStartNav}
                className="flex-1 bg-blue-500 h-13 rounded-2xl items-center justify-center shadow-md shadow-blue-500/20 active:bg-blue-600"
                accessibilityLabel="Dẫn đường đến địa chỉ này"
                accessibilityRole="button"
              >
                <Text className="text-white font-bold text-base">🧭 Dẫn đường</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBookmarkToggle}
                className={`flex-1 border h-13 rounded-2xl items-center justify-center active:bg-gray-50 ${
                  house.isBookmarked ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-white'
                }`}
                accessibilityLabel={house.isBookmarked ? 'Bỏ lưu địa chỉ' : 'Lưu địa chỉ này'}
                accessibilityRole="button"
              >
                <Text className={`font-bold text-base ${house.isBookmarked ? 'text-red-500' : 'text-gray-700'}`}>
                  {house.isBookmarked ? '❤️ Đã lưu' : '🤍 Lưu lại'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Report Address Discrepancy */}
            <TouchableOpacity
              onPress={showReportAlert}
              className="w-full mt-4 border border-dashed border-gray-300 h-12 rounded-2xl items-center justify-center active:bg-gray-50"
              accessibilityLabel="Báo cáo thông tin sai"
              accessibilityRole="button"
            >
              <Text className="text-gray-400 font-semibold text-sm">⚠️ Báo cáo thông tin sai lệch</Text>
            </TouchableOpacity>

            {/* Building Layouts for Offices */}
            {house.type === 'office' && house.buildingLayouts && (
              <View className="w-full mt-8 border-t border-gray-100 pt-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  Sơ đồ Tòa nhà (Floor Plans)
                </Text>
                {house.buildingLayouts.map((floor, index) => (
                  <View key={index} className="mb-6 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <Text className="text-base font-bold text-gray-800 mb-3 ml-1">
                      📍 {floor.floorNumber}
                    </Text>
                    <Image
                      source={{ uri: floor.planImageUrl }}
                      className="w-full h-64 rounded-xl bg-white"
                      resizeMode="contain"
                      accessibilityLabel={`Sơ đồ ${floor.floorNumber}`}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
