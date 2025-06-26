import React from 'react';
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
  results = [],
}: any) => {
  return (
    <View className="w-full mt-4">
      <View
        className={`${values == '' ? 'hidden' : 'block'} flex-row items-center justify-between`}>
        <Text className="text-gray-600">{placeholder}</Text>
      </View>
      <TextInput
        className="w-full p-3 mt-4 border border-gray-300 rounded-lg"
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        autoCorrect={false}
        value={values}
      />
      {results.length !== 0 && (
        <ScrollView className="mt-2 max-h-40">
          {results.map((result: any, index: number) => (
            <View key={index} className="flex-row items-center p-2 border-b border-gray-200">
              <Feather name="search" size={20} color="gray" />
              <Text className="ml-2 text-gray-700">{result.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
