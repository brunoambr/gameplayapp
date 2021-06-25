import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  Share,
  Text,
  View
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { AppointmentProps } from '../../components/Appointment';
import { Background } from '../../components/Background';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import { Load } from '../../components/Load';
import { Member, MemberProps } from '../../components/Member';

import BannerImg from '../../assets/banner.png';
import { styles } from './styles';
import { theme } from '../../global/styles/theme';
import { api } from '../../services/api';

interface Params {
  appointmentSelected: AppointmentProps;
}

interface GuildWidget {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
}

export function AppointmentDetails() {
  const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { appointmentSelected } = route.params as Params;

  async function fetchGuildWidget() {
    try {
      const response = await api.get(`/guilds/${appointmentSelected.guild.id}/widget.json`);
      setWidget(response.data);
    } catch {
      Alert.alert('Verifique as configurações do servidor. Será que o Widget está habilitado?');
    } finally {
      setLoading(false);
    }
  }

  function handleShareInvitation() {
    // const message = Platform.OS === 'ios' ?
    // `Junte-se a ${appointmentSelected.guild.name}` :
    // widget.instant_invite;
    const message = `Junte-se a ${appointmentSelected.guild.name}`;

    Share.share({
      message,
      url: widget.instant_invite
    });
  }

  function handleOpenGuild() {
    Linking.openURL(widget.instant_invite);
  }

  useEffect(() => {
    fetchGuildWidget();
  }, []);

  return (
    <Background>
      <Header
        title="Detalhes"
        action={
          appointmentSelected.guild.owner &&
          <BorderlessButton
            onPress={handleShareInvitation}
          >
            <Fontisto
              name="share"
              size={24}
              color={theme.colors.primary}
            />
          </BorderlessButton>
        }
      />

      <ImageBackground
        source={BannerImg}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.title}>
            {appointmentSelected.guild.name}
          </Text>

          <Text style={styles.subtitle}>
            {appointmentSelected.description}
          </Text>
        </View>
      </ImageBackground>

      {
        loading ? <Load /> :
          <>
            <ListHeader
              title="Jogadores"
              subtitle={`Total ${widget.members ? widget.members.length : 0}`}
            />

            <FlatList
              data={widget.members}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Member
                  data={item}
                />
              )}
              ItemSeparatorComponent={() => <ListDivider isCentered />}
              style={styles.members}
            />

            {
              appointmentSelected.guild.owner &&
              <View style={styles.footer}>
                <ButtonIcon
                  title="Entrar na partida"
                  onPress={handleOpenGuild}
                />
              </View>
            }

          </>
      }

    </Background>
  )
}