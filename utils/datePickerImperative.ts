import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { boolean } from 'yup';

export const datePickerImperative = (
  date: any,
  setDate: any,
  mode: any,
  is24Hours: boolean,
  title: string
) => {
  DateTimePickerAndroid.open({
    value: date,
    onChange: (event, selectedDate) => {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
      }
    },
    title: title,
    mode: mode,
    is24Hour: is24Hours,
  });
};
