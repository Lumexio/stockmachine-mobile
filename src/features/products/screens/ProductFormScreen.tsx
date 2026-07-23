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
import { Picker } from '@react-native-picker/picker';
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
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [costPrice, setCostPrice] = useState('0');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [minStock, setMinStock] = useState('10');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [shelveId, setShelveId] = useState<number | undefined>();
  const [rackId, setRackId] = useState<number | undefined>();
  const [supplierId, setSupplierId] = useState<number | undefined>();
  const [statusId, setStatusId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [shelves, setShelves] = useState<SelectOption[]>([]);
  const [racks, setRacks] = useState<SelectOption[]>([]);
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
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
        .get<{ data: SelectOption[] }>('/suppliers')
        .then((r) => r.data.data),
      apiClient
        .get<{ data: SelectOption[] }>('/status')
        .then((r) => r.data.data),
    ])
      .then(([c, s, r, sup, st]) => {
        setCategories(c);
        setShelves(s);
        setRacks(r);
        setSuppliers(sup);
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
      setDescription(selectedProduct.description || '');
      setQuantity(selectedProduct.quantity.toString());
      setCostPrice(selectedProduct.cost_price?.toString() || '0');
      setSellingPrice(selectedProduct.selling_price?.toString() || '0');
      setMinStock(selectedProduct.min_stock?.toString() || '10');
      setCategoryId(selectedProduct.category_id ?? undefined);
      setShelveId(selectedProduct.shelve_id ?? undefined);
      setRackId(selectedProduct.rack_id ?? undefined);
      setSupplierId(selectedProduct.supplier_id ?? undefined);
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
        description: description.trim(),
        quantity: parseInt(quantity, 10) || 0,
        cost_price: parseFloat(costPrice) || 0,
        selling_price: parseFloat(sellingPrice) || 0,
        min_stock: parseInt(minStock, 10) || 10,
        ...(categoryId !== undefined && { category_id: categoryId }),
        ...(shelveId !== undefined && { shelve_id: shelveId }),
        ...(rackId !== undefined && { rack_id: rackId }),
        ...(supplierId !== undefined && { supplier_id: supplierId }),
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
            {t('forms.label.products.description', 'Description')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            placeholder={t('forms.placeholders.description', 'Product Description')}
            testID="description-input"
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

        <View>
          <Text className="text-sm mb-1" style={{ color: colors.text }}>
            {t('forms.label.products.min_stock', 'Min Stock')}
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3"
            style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}
            placeholderTextColor={colors.textSecondary}
            value={minStock}
            onChangeText={setMinStock}
            keyboardType="numeric"
            placeholder="10"
            testID="min-stock-input"
          />
        </View>

        {categories.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.category_name')}
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label={t('forms.placeholders.selectCategory', 'Select Category')} value={undefined} />
                {categories.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {shelves.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.shelve_name')}
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <Picker
                selectedValue={shelveId}
                onValueChange={(itemValue) => setShelveId(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label={t('forms.placeholders.selectShelve', 'Select Shelve')} value={undefined} />
                {shelves.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {racks.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.rack_name')}
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <Picker
                selectedValue={rackId}
                onValueChange={(itemValue) => setRackId(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label={t('forms.placeholders.selectRack', 'Select Rack')} value={undefined} />
                {racks.map((r) => (
                  <Picker.Item key={r.id} label={r.name} value={r.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {suppliers.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.supplier_name', 'Supplier')}
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <Picker
                selectedValue={supplierId}
                onValueChange={(itemValue) => setSupplierId(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label={t('forms.placeholders.selectSupplier', 'Select Supplier')} value={undefined} />
                {suppliers.map((sup) => (
                  <Picker.Item key={sup.id} label={sup.name} value={sup.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {statuses.length > 0 && (
          <View>
            <Text className="text-sm mb-2" style={{ color: colors.text }}>
              {t('forms.label.products.status')}
            </Text>
            <View className="border rounded-lg overflow-hidden" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <Picker
                selectedValue={statusId}
                onValueChange={(itemValue) => setStatusId(itemValue)}
                style={{ color: colors.text }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label={t('forms.placeholders.selectStatus', 'Select Status')} value={undefined} />
                {statuses.map((st) => (
                  <Picker.Item key={st.id} label={st.name} value={st.id} />
                ))}
              </Picker>
            </View>
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
