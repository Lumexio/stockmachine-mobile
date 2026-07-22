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
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';
import { useProductsStore } from '../store/products-store';
import { apiClient } from '@api/axios-client';
import { NAV_KEYS } from '@constants/nav-keys';
import type { ProductsStackParamList } from '../types';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  typeof NAV_KEYS.PRODUCT_FORM
>;

interface SelectOption {
  id: number;
  name: string;
}

export function ProductFormScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeStore();
  const { id } = route.params;
  const isEdit = id !== undefined;
  const { selectedProduct, create, update, fetchById } = useProductsStore();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [costPrice, setCostPrice] = useState('0');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [shelveId, setShelveId] = useState<number | undefined>();
  const [rackId, setRackId] = useState<number | undefined>();
  const [statusId, setStatusId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [shelves, setShelves] = useState<SelectOption[]>([]);
  const [racks, setRacks] = useState<SelectOption[]>([]);
  const [statuses, setStatuses] = useState<SelectOption[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient
        .get<{ data: SelectOption[] }>('/categories')
        .then((r) => r.data.data),
      apiClient
        .get<{ data: SelectOption[] }>('/shelves')
        .then((r) => r.data.data),
      apiClient
        .get<{ data: SelectOption[] }>('/racks')
        .then((r) => r.data.data),
      apiClient
        .get<{ data: SelectOption[] }>('/status')
        .then((r) => r.data.data),
    ])
      .then(([c, s, r, st]) => {
        setCategories(c);
        setShelves(s);
        setRacks(r);
        setStatuses(st);
      })
      .catch(() => null);

    if (isEdit && id !== undefined) {
      fetchById(id);
    }
  }, [id, isEdit, fetchById]);

  useEffect(() => {
    if (isEdit && selectedProduct) {
      setName(selectedProduct.name);
      setQuantity(selectedProduct.quantity.toString());
      setCostPrice(selectedProduct.cost_price?.toString() || '0');
      setSellingPrice(selectedProduct.selling_price?.toString() || '0');
      setCategoryId(selectedProduct.category_id ?? undefined);
      setShelveId(selectedProduct.shelve_id ?? undefined);
      setRackId(selectedProduct.rack_id ?? undefined);
      setStatusId(selectedProduct.status_id ?? undefined);
    }
  }, [isEdit, selectedProduct]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', t('forms.validation.required'));
      return;
    }
    setSaving(true);
    try {
      const dto = {
        name: name.trim(),
        quantity: parseInt(quantity, 10) || 0,
        cost_price: parseFloat(costPrice) || 0,
        selling_price: parseFloat(sellingPrice) || 0,
        ...(categoryId !== undefined && { category_id: categoryId }),
        ...(shelveId !== undefined && { shelve_id: shelveId }),
        ...(rackId !== undefined && { rack_id: rackId }),
        ...(statusId !== undefined && { status_id: statusId }),
      };
      if (isEdit && id !== undefined) {
        await update(id, dto);
      } else {
        await create(dto);
      }
      navigation.goBack();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || t('messages.error.create');
      Alert.alert('', msg);
    } finally {
      setSaving(false);
    }
  };

  const chipCls = (selected: boolean) =>
    `mr-2 px-3 py-2 rounded-full border ${
      selected ? '' : 'border-gray-300'
    }`;
    
  const chipStyles = (selected: boolean) => ({
    backgroundColor: selected ? Colors.primary : colors.surface,
    borderColor: selected ? Colors.primary : colors.border,
  });

  const chipTextCls = (selected: boolean) =>
    `text-sm ${selected ? 'text-white' : ''}`;
    
  const chipTextStyles = (selected: boolean) => ({
    color: selected ? 'white' : colors.text
  });

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="p-4" style={{ gap: 16 }}>
        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.products.name')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            placeholder={t('forms.placeholders.name')}
            testID="name-input"
          />
        </View>

        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.products.quantity')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder={t('forms.placeholders.quantity')}
            testID="quantity-input"
          />
        </View>

        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.products.cost_price')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={costPrice}
            onChangeText={setCostPrice}
            keyboardType="numeric"
            placeholder="0.00"
            testID="cost-price-input"
          />
        </View>

        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.products.selling_price')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={sellingPrice}
            onChangeText={setSellingPrice}
            keyboardType="numeric"
            placeholder="0.00"
            testID="selling-price-input"
          />
        </View>

        {categories.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.category_name')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() =>
                    setCategoryId(c.id === categoryId ? undefined : c.id)
                  }
                  className={chipCls(c.id === categoryId)}
                  style={chipStyles(c.id === categoryId)}
                >
                  <Text className={chipTextCls(c.id === categoryId)} style={chipTextStyles(c.id === categoryId)}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {shelves.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.shelve_name')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shelves.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() =>
                    setShelveId(s.id === shelveId ? undefined : s.id)
                  }
                  className={chipCls(s.id === shelveId)}
                  style={chipStyles(s.id === shelveId)}
                >
                  <Text className={chipTextCls(s.id === shelveId)} style={chipTextStyles(s.id === shelveId)}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {racks.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.rack_name')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {racks.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setRackId(r.id === rackId ? undefined : r.id)}
                  className={chipCls(r.id === rackId)}
                  style={chipStyles(r.id === rackId)}
                >
                  <Text className={chipTextCls(r.id === rackId)} style={chipTextStyles(r.id === rackId)}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {statuses.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.status')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() =>
                    setStatusId(s.id === statusId ? undefined : s.id)
                  }
                  className={chipCls(s.id === statusId)}
                  style={chipStyles(s.id === statusId)}
                >
                  <Text className={chipTextCls(s.id === statusId)} style={chipTextStyles(s.id === statusId)}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-red-600 rounded-xl py-4 items-center mt-2"
          testID="save-button"
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {t('actions.save')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
