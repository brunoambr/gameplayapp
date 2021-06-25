import React, { ReactNode } from 'react';
import {
  Modal,
  ModalProps,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Background } from '../Background';

import { styles } from './styles';

interface Props extends ModalProps {
  children: ReactNode;
  closeModal: () => void;
}

export function ModalView({
  children, 
  closeModal,
  ...rest
}: Props) {
  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      {...rest}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Background>
              <View style={styles.bar} />
              {children}
            </Background>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}