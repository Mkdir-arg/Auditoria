import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import { getStorage } from '../utils/storage'

export const FormularioRelevamientoScreen = ({ route, navigation }: any) => {
  const { visitaId } = route.params
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    loadFormData()
  }, [])

  const loadFormData = async () => {
    const storage = getStorage()
    const saved = await storage.getItem(`formulario_visita_${visitaId}`)
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }

  const saveFormData = async () => {
    const storage = getStorage()
    await storage.setItem(`formulario_visita_${visitaId}`, JSON.stringify(formData))
    Alert.alert('Éxito', 'Formulario guardado')
    navigation.goBack()
  }

  const updateField = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    })
  }

  const renderBooleanField = (section: string, field: string, label: string) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.booleanButtons}>
        <TouchableOpacity
          style={[styles.booleanButton, formData[section]?.[field] === true && styles.booleanButtonActive]}
          onPress={() => updateField(section, field, true)}
        >
          <Text style={styles.booleanButtonText}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.booleanButton, formData[section]?.[field] === false && styles.booleanButtonActive]}
          onPress={() => updateField(section, field, false)}
        >
          <Text style={styles.booleanButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTextField = (section: string, field: string, label: string) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={formData[section]?.[field] || ''}
        onChangeText={(value) => updateField(section, field, value)}
        multiline
      />
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Formulario de Relevamiento</Text>
      </View>

      {/* Sección 1: Prestación */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Prestación del Servicio</Text>
        {renderBooleanField('prestacion', 'servicio_funcionando', '¿El servicio está funcionando?')}
        {renderTextField('prestacion', 'observaciones', 'Observaciones')}
      </View>

      {/* Sección 2: Cantidad de Raciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Cantidad de Raciones</Text>
        {renderTextField('raciones', 'cantidad_programada', 'Cantidad programada')}
        {renderTextField('raciones', 'cantidad_servida', 'Cantidad servida')}
      </View>

      {/* Sección 3: Control de Temperaturas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Control de Temperaturas</Text>
        {renderBooleanField('temperaturas', 'control_realizado', '¿Se realiza control de temperatura?')}
        {renderTextField('temperaturas', 'temperatura_frio', 'Temperatura frío (°C)')}
        {renderTextField('temperaturas', 'temperatura_caliente', 'Temperatura caliente (°C)')}
      </View>

      {/* Sección 4: Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Personal</Text>
        {renderTextField('personal', 'cantidad', 'Cantidad de personal')}
        {renderBooleanField('personal', 'capacitacion', '¿Personal capacitado?')}
      </View>

      {/* Sección 5: Hábitos Higiénicos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Hábitos Higiénicos</Text>
        {renderBooleanField('higiene', 'lavado_manos', '¿Se lavan las manos?')}
        {renderBooleanField('higiene', 'uso_cofia', '¿Usan cofia?')}
        {renderBooleanField('higiene', 'uso_barbijo', '¿Usan barbijo?')}
      </View>

      {/* Botones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={saveFormData}>
          <Text style={styles.saveButtonText}>💾 Guardar Formulario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#4F46E5', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  section: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#111827' },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
  booleanButtons: { flexDirection: 'row', gap: 12 },
  booleanButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center' },
  booleanButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  booleanButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  textInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  actions: { padding: 16, gap: 12 },
  saveButton: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#6B7280', padding: 16, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
})
