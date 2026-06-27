import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { IHouse, ICoordinate, ELocationType } from '../../../../packages/core/src/mock-data';
import { HouseBottomSheet, HouseBottomSheetRef } from '../components/HouseBottomSheet';
import { MapErrorState } from '../components/MapErrorState';
import { SearchBar } from '../components/SearchBar';
import { useMapData } from '../hooks/useMapData';

// ── Constants ─────────────────────────────────────────────────────────────────

const INITIAL_REGION = {
  latitude: 10.762800,
  longitude: 106.660300,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};

// Simulated starting location (e.g., entrance of the alley)
const NAV_START_LOC: ICoordinate = { latitude: 10.76258, longitude: 106.66010 };

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 40;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getHouseNumber(address: string, fallback: string): string {
  return address.split('/')[1]?.split(' ')[0] ?? fallback;
}

function buildNavPoints(
  navHouse: IHouse,
  routeData: ICoordinate[]
): ICoordinate[] {
  const routeSegment = routeData.filter(
    (pt) => pt.latitude <= navHouse.coordinate.latitude
  );
  return [NAV_START_LOC, ...routeSegment, navHouse.coordinate];
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface HouseMarkerProps {
  house: IHouse;
  isNavigated: boolean;
  onPress: (house: IHouse) => void;
}

const HouseMarker = ({ house, isNavigated, onPress }: HouseMarkerProps) => {
  const isOffice = house.type === ELocationType.Office;
  const number = getHouseNumber(house.address, house.id);

  const handlePress = useCallback(() => onPress(house), [house, onPress]);

  const containerClass = isNavigated
    ? 'bg-white border-2 items-center justify-center shadow-lg px-2 py-1.5 flex-row border-emerald-500 bg-emerald-50 rounded-xl'
    : isOffice
    ? 'bg-white border-2 items-center justify-center shadow-lg px-2 py-1.5 flex-row border-orange-500 rounded-lg'
    : 'bg-white border-2 items-center justify-center shadow-lg px-2 py-1.5 flex-row border-blue-500 rounded-full';

  const textClass = isNavigated
    ? 'font-bold text-xs text-emerald-600'
    : isOffice
    ? 'font-bold text-xs text-orange-500'
    : 'font-bold text-xs text-blue-500';

  return (
    <Marker
      key={house.id}
      coordinate={house.coordinate}
      onPress={handlePress}
    >
      <View className={containerClass}>
        <Text className="text-[10px] mr-1">{isOffice ? '🏢' : '🏠'}</Text>
        <Text className={textClass}>{number}</Text>
        {house.isBookmarked && (
          <Text className="text-[10px] ml-1 text-red-500">❤️</Text>
        )}
      </View>
    </Marker>
  );
};

// ── MapScreen ─────────────────────────────────────────────────────────────────

export const MapScreen = () => {
  const bottomSheetRef = useRef<HouseBottomSheetRef>(null);
  const { data, isLoading, error, retry } = useMapData();

  const [navHouse, setNavHouse] = useState<IHouse | null>(null);
  const [visibleHouses, setVisibleHouses] = useState<IHouse[] | null>(null);

  // Sync visible houses when data first loads
  const allHouses = data?.houses ?? null;
  const displayedHouses = visibleHouses ?? allHouses;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleMarkerPress = useCallback((house: IHouse) => {
    bottomSheetRef.current?.present(house);
  }, []);

  const handleStartNav = useCallback((house: IHouse) => {
    setNavHouse(house);
  }, []);

  const handleCancelNav = useCallback(() => {
    setNavHouse(null);
  }, []);

  const handleToggleBookmark = useCallback((updatedHouse: IHouse) => {
    setVisibleHouses((prev) =>
      prev
        ? prev.map((h) => (h.id === updatedHouse.id ? updatedHouse : h))
        : null
    );
  }, []);

  const handleSearchResults = useCallback((filtered: IHouse[]) => {
    setVisibleHouses(filtered);
  }, []);

  // ── Derived nav route ────────────────────────────────────────────────────────

  const navPoints = useMemo(() => {
    if (!navHouse || !data?.route) return [];
    return buildNavPoints(navHouse, data.route);
  }, [navHouse, data?.route]);

  // ── Render states ────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500 font-medium text-sm">Đang tải bản đồ...</Text>
      </View>
    );
  }

  if (error) {
    return <MapErrorState message={error} onRetry={retry} />;
  }

  // ── Main render ──────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-gray-50">
      <MapView style={{ flex: 1 }} initialRegion={INITIAL_REGION}>
        {/* Alley route polyline */}
        {data?.route && (
          <Polyline coordinates={data.route} strokeColor="#93c5fd" strokeWidth={6} />
        )}

        {/* Active navigation polyline */}
        {navHouse && navPoints.length > 0 && (
          <Polyline
            coordinates={navPoints}
            strokeColor="#10b981"
            strokeWidth={5}
            lineDashPattern={[5, 5]}
          />
        )}

        {/* House / office markers */}
        {displayedHouses?.map((house) => (
          <HouseMarker
            key={house.id}
            house={house}
            isNavigated={navHouse?.id === house.id}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* Floating HUD Card */}
      <View
        style={{ top: STATUS_BAR_HEIGHT + 10 }}
        className="absolute left-4 right-4"
      >
        {/* Header info */}
        <View className="bg-white/95 rounded-3xl p-4 shadow-xl border border-gray-100 mb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-900 font-extrabold text-lg">📍 Hẻm 123 Nguyễn Trãi</Text>
              <Text className="text-gray-500 font-bold text-xs mt-0.5">Quận 5, TP. Hồ Chí Minh</Text>
            </View>
            <View className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Text className="text-blue-600 font-extrabold text-xs">🛵 Hẻm Xe Máy</Text>
            </View>
          </View>

          {navHouse && (
            <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-4">
                <Text className="text-lg mr-2">🟢</Text>
                <Text className="text-gray-700 font-semibold text-sm" numberOfLines={1}>
                  Đang dẫn tới nhà {getHouseNumber(navHouse.address, navHouse.id)} (khoảng 35m)
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCancelNav}
                className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl active:bg-red-100"
              >
                <Text className="text-red-500 font-extrabold text-xs">Hủy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Search bar */}
        {allHouses && (
          <SearchBar houses={allHouses} onResults={handleSearchResults} />
        )}
      </View>

      <HouseBottomSheet
        ref={bottomSheetRef}
        onStartNavigation={handleStartNav}
        onToggleBookmark={handleToggleBookmark}
      />
    </View>
  );
};
