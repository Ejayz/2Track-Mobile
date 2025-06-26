import { Formik } from 'formik';
import { useState } from 'react';
import { View, Text, Button, TextInput, GestureResponderEvent } from 'react-native';
import { InputSearch } from './FormComponents/InputSearch';
import { InputText } from './FormComponents/InputText';

export const NewOrderFabrication = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl font-bold text-gray-800">New Order Fabrication</Text>
      <Formik
        initialValues={{ order_id: '', pallet_count: '', customer_name: '', product_name: '' }}

        onSubmit={(values) => {}}>


        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View className="w-full p-4">
            <InputText
              values={values.order_id}
              handleChange={handleChange('order_id')}
              errors={errors.order_id}
              touched={touched.order_id}
              placeholder="Order ID"
              textContentType="none"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="default"
            />
               <InputText
              values={values.pallet_count}
              handleChange={handleChange('pallet_count')}
              errors={errors.pallet_count}
              touched={touched.pallet_count}
              placeholder="Pallet Count"
              textContentType="none"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="default"
            />
            <InputSearch
              values={customerName}
              onChangeText={setCustomerName}
              placeholder="Search Customer"
              textContentType="name"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              results={[]}
            />
            <InputSearch
              values={productName}
              onChangeText={setProductName}
              placeholder="Search Product"
              textContentType="name"
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              results={[]}
            />

            <View className="mt-4">
              <Button
                onPress={handleSubmit as unknown as (e: GestureResponderEvent) => void}
                title="Submit Order"
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
