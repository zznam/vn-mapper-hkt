import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { IHouse } from '../../../../packages/core/src/mock-data';

interface Props {
  houses: IHouse[];
  onResults: (filteredHouses: IHouse[]) => void;
}

const clearSearch = (
  setText: React.Dispatch<React.SetStateAction<string>>,
  allHouses: IHouse[],
  onResults: (h: IHouse[]) => void
) => {
  setText('');
  onResults(allHouses);
};

export const SearchBar = ({ houses, onResults }: Props) => {
  const [text, setText] = useState('');

  const handleChange = useCallback(
    (value: string) => {
      setText(value);
      const query = value.trim().toLowerCase();

      if (!query) {
        onResults(houses);
        return;
      }

      const filtered = houses.filter((house) => {
        const addressMatch = house.address.toLowerCase().includes(query);
        const detailsMatch = house.details?.toLowerCase().includes(query) ?? false;
        const tagMatch = house.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false;
        return addressMatch || detailsMatch || tagMatch;
      });

      onResults(filtered);
    },
    [houses, onResults]
  );

  const handleClear = useCallback(
    () => clearSearch(setText, houses, onResults),
    [houses, onResults]
  );

  return (
    <View className="flex-row items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-4 h-11">
      <Text className="text-gray-400 text-base mr-2">🔍</Text>
      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="Tìm địa chỉ, nhà, văn phòng..."
        placeholderTextColor="#9ca3af"
        className="flex-1 text-gray-900 text-sm font-medium"
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
      {text.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2 p-1">
          <Text className="text-gray-400 text-xs font-bold">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
