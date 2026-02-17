import React, { Children } from 'react';
import { View, TextInput, Text, ScrollView, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const SearchState = ({
  values,
  placeholder,
  textContentType,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  autoComplete,
  onChangeText,
  isSearching,
  children,
}: any) => {
  return (
    <View className="w-1/2 ">
      {/* <View
        className={`${values == '' ? 'hidden' : 'block'} flex-row items-center justify-between`}>
        <Text className="text-gray-600">{placeholder}</Text>
      </View> */}
      <TextInput
        className="w-full p-3 text-black border border-gray-300 rounded-lg "
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        autoCorrect={false}
        value={values}
        onPress={() => {
          onChangeText('');
        }}
      />
    </View>
  );
};
