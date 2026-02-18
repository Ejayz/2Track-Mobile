import React, { Children } from 'react';
import { View, TextInput, Text, ScrollView, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const InputSearch = ({
  setFieldValue,
  field,
  values,
  errors,
  touched,
  placeholder,
  keyboardType,
  autoCapitalize,
  onChangeText,
  children,
}: any) => {
  console.log(values, 'values in input search');
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
          setFieldValue(field, '');
        }}
      />

      <View className={`mt-2 flex-row text-red-500 ${errors && touched ? 'block' : 'hidden'}`}>
        <Feather className="my-auto" name="alert-triangle" size={20} color="red" />
        <Text className="my-auto ml-2 text-red-500">{errors}</Text>
      </View>
      <ScrollView className="mt-2 max-h-40">{children}</ScrollView>
    </View>
  );
};
