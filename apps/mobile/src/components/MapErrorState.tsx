import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  message?: string;
  onRetry: () => void;
}

export const MapErrorState = ({ message, onRetry }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-5xl mb-4">🗺️</Text>
      <Text className="text-gray-900 font-extrabold text-xl text-center mb-2">
        Không tải được bản đồ
      </Text>
      <Text className="text-gray-500 text-sm text-center leading-relaxed mb-8">
        {message ?? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="bg-blue-500 px-8 py-3 rounded-2xl active:bg-blue-600"
      >
        <Text className="text-white font-bold text-base">🔄 Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
};
