import React, { Children } from 'react';
import { View, TextInput, Text, ScrollView, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const InputSearch = ({
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
    <View className="w-full mt-4">
      <View
        className={`${values == '' ? 'hidden' : 'block'} flex-row items-center justify-between`}>
        <Text className="text-gray-600">{placeholder}</Text>
      </View>
      <TextInput
        className="w-full p-3 mt-4 text-black border border-gray-300 rounded-lg"
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
      {isSearching ? (
        <View className="flex-row items-center justify-center mt-2">
          <Feather name="loader" size={20} color="gray" className='animate-spin' />
          <Text className="ml-2 text-gray-600">Searching...</Text>
        </View>
      ) : (
        <ScrollView className="mt-2 max-h-40">{children}</ScrollView>
      )}
    </View>
  );
};
