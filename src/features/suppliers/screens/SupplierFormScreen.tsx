import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSuppliersStore } from '../store/suppliers-store';
import { NAV_KEYS } from '@constants/nav-keys';
import type { SuppliersStackParamList } from '../types';

type Props = NativeStackScreenProps<
  SuppliersStackParamList,
  typeof NAV_KEYS.SUPPLIER_FORM
>;

export function SupplierFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { id } = route.params;
  const isEdit = id !== undefined;
  const { selectedSupplier, create, update, fetchById } = useSuppliersStore();

  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id !== undefined) {
      fetchById(id);
    }
  }, [id, isEdit, fetchById]);

  useEffect(() => {
    if (isEdit && selectedSupplier) {
      setName(selectedSupplier.name);
      setContactName(selectedSupplier.contact_name ?? '');
      setEmail(selectedSupplier.email ?? '');
      setPhone(selectedSupplier.phone ?? '');
      setAddress(selectedSupplier.address ?? '');
    }
  }, [isEdit, selectedSupplier]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('forms.validation.required', 'Name is required'));
      return;
    }
    setSaving(true);
    try {
      const dto = {
        name: name.trim(),
        ...(contactName.trim() && { contact_name: contactName.trim() }),
        ...(email.trim() && { email: email.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
        ...(address.trim() && { address: address.trim() }),
      };
      if (isEdit && id !== undefined) {
        await update(id, dto);
      } else {
        await create(dto);
      }
      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || t('messages.error.create', 'Error');
      Alert.alert('', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={{ gap: 16 }}>
        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.suppliers.name', 'Name')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={name}
            onChangeText={setName}
            placeholder={t('forms.placeholders.name', 'Enter name')}
          />
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.suppliers.contact_name', 'Contact Name')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={contactName}
            onChangeText={setContactName}
            placeholder={t('forms.placeholders.contact_name', 'Enter contact name')}
          />
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.suppliers.email', 'Email')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={t('forms.placeholders.email', 'Enter email')}
          />
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.suppliers.phone', 'Phone')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder={t('forms.placeholders.phone', 'Enter phone')}
          />
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">
            {t('forms.label.suppliers.address', 'Address')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            placeholder={t('forms.placeholders.address', 'Enter address')}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-red-600 rounded-xl py-4 items-center mt-2"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {t('actions.save', 'Save')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
