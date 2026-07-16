import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export type StockAction = 'entry' | 'withdrawal';

interface StockActionSheetProps {
  visible: boolean;
  action: StockAction | null;
  onClose: () => void;
  onConfirm: (quantity: number, notes: string) => Promise<void>;
}

export function StockActionSheet({
  visible,
  action,
  onClose,
  onConfirm,
}: StockActionSheetProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setQuantity('');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    const qty = parseInt(quantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) {
      setError(t('forms.validation.required'));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onConfirm(qty, notes.trim());
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('messages.error.update'));
    } finally {
      setLoading(false);
    }
  };

  const title =
    action === 'entry' ? t('actions.entry') : t('actions.withdrawal');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View className="bg-white rounded-t-2xl p-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  {title}
                </Text>

                {error !== null && (
                  <Text className="text-red-600 text-sm mb-3">{error}</Text>
                )}

                <Text className="text-sm text-gray-600 mb-1">
                  {t('common.quantity')}
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder={t('forms.placeholders.quantity')}
                  testID="stock-quantity-input"
                />

                <Text className="text-sm text-gray-600 mb-1">
                  {t('common.notes')} ({t('common.optional')})
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder={t('forms.placeholders.notes')}
                  multiline
                  numberOfLines={3}
                  testID="stock-notes-input"
                />

                <View className="flex-row" style={{ gap: 12 }}>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 border border-gray-300 rounded-lg py-3 items-center"
                  >
                    <Text className="text-gray-700">{t('actions.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={loading}
                    className="flex-1 bg-red-600 rounded-lg py-3 items-center"
                    testID="stock-confirm-button"
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-semibold">
                        {t('actions.confirm')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
