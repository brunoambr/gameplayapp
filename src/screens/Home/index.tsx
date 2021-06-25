import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Appointment, AppointmentProps } from '../../components/Appointment';
import { Background } from '../../components/Background';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import { Load } from '../../components/Load';
import { Profile } from '../../components/Profile';

import { styles } from './styles';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';

export function Home() {
  const [category, setCategory] = useState('');
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  function handleAppointmentCreate() {
    navigation.navigate('AppointmentCreate');
  }

  function handleAppointmentDetails(appointmentSelected: AppointmentProps) {
    navigation.navigate('AppointmentDetails', { appointmentSelected });
  }

  function handleCategorySelection(categoryId: string) {
    categoryId === category ? setCategory('') : setCategory(categoryId)
  }

  async function loadAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if (category) {
      setAppointments(storage.filter(item => item.category === category));
    }
    else {
      setAppointments(storage);
    }

    setLoading(false);

  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  }, [category]));

  return (
    <Background>

      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate} />
      </View>

      <CategorySelect
        categorySelected={category}
        setCategory={handleCategorySelection}
      />

      {
        loading ? <Load /> :
          <>
            <ListHeader
              title="Partidas agendadas"
              subtitle={`Total ${appointments.length}`}
            />

            <FlatList
              data={appointments}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Appointment
                  data={item}
                  onPress={() => handleAppointmentDetails(item)}
                />
              )}
              style={styles.matches}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <ListDivider />}
              contentContainerStyle={{ paddingBottom: 69 }}
            />
          </>
      }

    </Background>
  );
}