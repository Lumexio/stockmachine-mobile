import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/auth-store';
import { useThemeStore } from '@store/theme-store';
import { Colors } from '@constants/theme';
import { apiClient } from '@api/axios-client';

export function LocationPicker() {
  const { user, locations, currentLocationId, setCurrentLocationId, fetchLocations } = useAuthStore();
  const { colors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [creating, setCreating] = useState(false);

  // Only Admin or Owner
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) return null;

  const currentLoc = locations.find(l => l.id === currentLocationId);

  const handleCreate = async () => {
    if (!newLocationName.trim()) return;
    setCreating(true);
    try {
      await apiClient.post(`/organizations/${user.org_id}/locations`, { name: newLocationName.trim() });
      await fetchLocations();
      setNewLocationName('');
      setCreateMode(false);
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to create location');
    } finally {
      setCreating(false);
    }
  };

  const handleSelect = (id: number) => {
    setCurrentLocationId(id);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, backgroundColor: `${Colors.primary}1A`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 }}>
        <MaterialCommunityIcons name="map-marker" size={18} color={Colors.primary} />
        <Text style={{ color: Colors.primary, fontWeight: '700', marginLeft: 6, marginRight: 4, maxWidth: 100 }} numberOfLines={1}>
          {currentLoc?.name || 'Location'}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.primary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => { setModalVisible(false); setCreateMode(false); }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPressOut={() => { setModalVisible(false); setCreateMode(false); }}>
          <View style={{ width: '85%', backgroundColor: colors.card, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }} onStartShouldSetResponder={() => true}>
            {!createMode ? (
              <>
                <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Select Location</Text>
                {locations.map(loc => (
                  <TouchableOpacity key={loc.id} onPress={() => handleSelect(loc.id)} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' }}>
                    {loc.id === currentLocationId ? (
                       <MaterialCommunityIcons name="check-circle" size={22} color={Colors.primary} style={{ marginRight: 12 }} />
                    ) : (
                       <View style={{ width: 34 }} />
                    )}
                    <Text style={{ color: loc.id === currentLocationId ? Colors.primary : colors.text, fontSize: 16, flex: 1, fontWeight: loc.id === currentLocationId ? 'bold' : '500' }}>{loc.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setCreateMode(true)} style={{ paddingVertical: 14, flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: `${Colors.primary}15`, borderRadius: 12, paddingHorizontal: 12 }}>
                  <MaterialCommunityIcons name="plus-circle" size={22} color={Colors.primary} />
                  <Text style={{ color: Colors.primary, fontSize: 16, marginLeft: 12, fontWeight: 'bold' }}>Create New Location</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>New Location</Text>
                <TextInput
                  style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 }}
                  placeholder="Location Name"
                  placeholderTextColor={colors.textSecondary}
                  value={newLocationName}
                  onChangeText={setNewLocationName}
                  autoFocus
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                  <TouchableOpacity onPress={() => setCreateMode(false)} style={{ padding: 12 }}>
                    <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCreate} disabled={creating} style={{ padding: 12, backgroundColor: Colors.primary, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                    {creating ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Create</Text>}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
