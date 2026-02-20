import React from 'react';
import { View, TextInput, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export const InputText = ({
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
}: any) => {
  return (
    <View className="mt-4 w-full ">
      <View
        className={`${values == '' ? 'hidden' : 'block'} flex-row items-center justify-between text-black`}>
        <Text className="text-black">{placeholder}</Text>
      </View>
      <TextInput
        className="mt-4 w-full rounded-lg border border-black p-3 text-black "
        placeholder={placeholder}
        value={values}
        onChangeText={handleChange}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        autoComplete={autoComplete || 'email'}
        placeholderTextColor={'black'}
        autoCorrect={false}
        textContentType={textContentType || 'emailAddress'}
      />
      <View className={`mt-2 flex-row text-red-500 ${errors && touched ? 'block' : 'hidden'}`}>
        <Feather className="my-auto" name="alert-triangle" size={20} color="red" />
        <Text className="my-auto ml-2 text-red-500">{errors}</Text>
      </View>
    </View>
  );
};
