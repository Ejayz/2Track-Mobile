import React from 'react';
import { View, TextInput, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const InputPassword = ({
  values,
  handleChange,
  errors,
  touched,
  placeholder,
  textContentType,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  autoComplete,
  checked = false, // Default value for checked
}: any) => {
  return (
    <View className="mt-4 w-full ">
      <View
        className={`${values == '' ? 'hidden' : 'block'} flex-row items-center justify-between`}>
        <Text className="text-gray-600">{placeholder}</Text>
      </View>
      <TextInput
        className="mt-4 w-full rounded-lg border border-black p-3 text-black"
        placeholder={placeholder || 'Password'}
        secureTextEntry={!checked}
        value={values}
        onChangeText={handleChange}
        autoCapitalize={autoCapitalize || 'none'}
        autoComplete={autoComplete || 'password'}
        autoCorrect={autoCorrect || false}
        textContentType={textContentType || 'password'}
        placeholderTextColor={'black'}
      />
      <View className={`mt-2 flex-row text-red-500 ${errors && touched ? 'block' : 'hidden'}`}>
        <Feather className="my-auto" name="alert-triangle" size={20} color="red" />
        <Text className="my-auto ml-2 text-red-500">{errors}</Text>
      </View>
    </View>
  );
};
