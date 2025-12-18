import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { RadioButton } from '../components/RadioButton';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

const SECCIONES = [
  { id: 1, titulo: 'Datos Generales', icon: '📋' },
  { id: 2, titulo: 'Infraestructura', icon: '🏗️' },
  { id: 3, titulo: 'Higiene', icon: '🧼' },
  { id: 4, titulo: 'Personal', icon: '👥' },
  { id: 5, titulo: 'Almacenamiento', icon: '📦' },
  { id: 6, titulo: 'Preparación', icon: '👨‍🍳' },
  { id: 7, titulo: 'Servicio', icon: '🍽️' },
  { id: 8, titulo: 'Residuos', icon: '♻️' },
  { id: 9, titulo: 'Documentación', icon: '📄' },
  { id: 10, titulo: 'Observaciones', icon: '📝' },
];

export function FormularioScreen({ route, navigation }: any) {
  const { visitaId } = route.params;
  const [seccionActual, setSeccionActual] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    const key = `@formulario_${visitaId}`;
    const data = await AsyncStorage.getItem(key);
    if (data) {
      setFormData(JSON.parse(data));
    }
  };

  const saveFormData = async () => {
    const key = `@formulario_${visitaId}`;
    await AsyncStorage.setItem(key, JSON.stringify(formData));
  };

  const updateField = (seccion: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [`seccion${seccion}_${field}`]: value,
    }));
  };

  const handleSiguiente = async () => {
    await saveFormData();
    if (seccionActual < 10) {
      setSeccionActual(seccionActual + 1);
    } else {
      handleGuardar();
    }
  };

  const handleAnterior = () => {
    if (seccionActual > 1) {
      setSeccionActual(seccionActual - 1);
    }
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      await saveFormData();

      // Actualizar visita con formulario
      const visitasData = await AsyncStorage.getItem('@visitas');
      if (visitasData) {
        const visitas = JSON.parse(visitasData);
        const index = visitas.findIndex((v: any) => v.id === visitaId);
        if (index !== -1) {
          visitas[index].formulario_data = JSON.stringify(formData);
          await AsyncStorage.setItem('@visitas', JSON.stringify(visitas));
        }
      }

      Alert.alert('Éxito', 'Formulario guardado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el formulario');
    } finally {
      setLoading(false);
    }
  };

  const renderSeccion = () => {
    switch (seccionActual) {
      case 1:
        return renderSeccion1();
      case 2:
        return renderSeccion2();
      case 3:
        return renderSeccion3();
      case 4:
        return renderSeccion4();
      case 5:
        return renderSeccion5();
      case 6:
        return renderSeccion6();
      case 7:
        return renderSeccion7();
      case 8:
        return renderSeccion8();
      case 9:
        return renderSeccion9();
      case 10:
        return renderSeccion10();
      default:
        return null;
    }
  };

  const renderSeccion1 = () => (
    <View>
      <Text style={styles.sectionTitle}>📋 Datos Generales</Text>
      
      <Text style={styles.label}>Responsable de la visita</Text>
      <Input
        value={formData.seccion1_responsable || ''}
        onChangeText={(v) => updateField(1, 'responsable', v)}
        placeholder="Nombre del auditor"
      />

      <Text style={styles.label}>Hora de inicio</Text>
      <Input
        value={formData.seccion1_hora_inicio || ''}
        onChangeText={(v) => updateField(1, 'hora_inicio', v)}
        placeholder="HH:MM"
      />

      <Text style={styles.label}>Hora de fin</Text>
      <Input
        value={formData.seccion1_hora_fin || ''}
        onChangeText={(v) => updateField(1, 'hora_fin', v)}
        placeholder="HH:MM"
      />

      <Text style={styles.label}>Cantidad de comensales</Text>
      <Input
        value={formData.seccion1_comensales || ''}
        onChangeText={(v) => updateField(1, 'comensales', v)}
        placeholder="Número"
        keyboardType="numeric"
      />
    </View>
  );

  const renderSeccion2 = () => (
    <View>
      <Text style={styles.sectionTitle}>🏗️ Infraestructura</Text>
      
      <Checkbox
        label="Cocina en buen estado"
        checked={formData.seccion2_cocina_buen_estado || false}
        onChange={(v) => updateField(2, 'cocina_buen_estado', v)}
      />

      <Checkbox
        label="Ventilación adecuada"
        checked={formData.seccion2_ventilacion || false}
        onChange={(v) => updateField(2, 'ventilacion', v)}
      />

      <Checkbox
        label="Iluminación suficiente"
        checked={formData.seccion2_iluminacion || false}
        onChange={(v) => updateField(2, 'iluminacion', v)}
      />

      <Checkbox
        label="Pisos y paredes limpios"
        checked={formData.seccion2_pisos_paredes || false}
        onChange={(v) => updateField(2, 'pisos_paredes', v)}
      />

      <Text style={styles.label}>Observaciones</Text>
      <Input
        value={formData.seccion2_observaciones || ''}
        onChangeText={(v) => updateField(2, 'observaciones', v)}
        placeholder="Detalles adicionales..."
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderSeccion3 = () => (
    <View>
      <Text style={styles.sectionTitle}>🧼 Higiene</Text>
      
      <Checkbox
        label="Personal usa cofia"
        checked={formData.seccion3_cofia || false}
        onChange={(v) => updateField(3, 'cofia', v)}
      />

      <Checkbox
        label="Personal usa delantal"
        checked={formData.seccion3_delantal || false}
        onChange={(v) => updateField(3, 'delantal', v)}
      />

      <Checkbox
        label="Lavado de manos frecuente"
        checked={formData.seccion3_lavado_manos || false}
        onChange={(v) => updateField(3, 'lavado_manos', v)}
      />

      <Checkbox
        label="Utensilios limpios"
        checked={formData.seccion3_utensilios || false}
        onChange={(v) => updateField(3, 'utensilios', v)}
      />

      <Text style={styles.label}>Estado general de higiene</Text>
      <RadioButton
        label="Excelente"
        selected={formData.seccion3_estado === 'excelente'}
        onPress={() => updateField(3, 'estado', 'excelente')}
      />
      <RadioButton
        label="Bueno"
        selected={formData.seccion3_estado === 'bueno'}
        onPress={() => updateField(3, 'estado', 'bueno')}
      />
      <RadioButton
        label="Regular"
        selected={formData.seccion3_estado === 'regular'}
        onPress={() => updateField(3, 'estado', 'regular')}
      />
      <RadioButton
        label="Malo"
        selected={formData.seccion3_estado === 'malo'}
        onPress={() => updateField(3, 'estado', 'malo')}
      />
    </View>
  );

  const renderSeccion4 = () => (
    <View>
      <Text style={styles.sectionTitle}>👥 Personal</Text>
      
      <Text style={styles.label}>Cantidad de personal</Text>
      <Input
        value={formData.seccion4_cantidad || ''}
        onChangeText={(v) => updateField(4, 'cantidad', v)}
        placeholder="Número"
        keyboardType="numeric"
      />

      <Checkbox
        label="Personal capacitado"
        checked={formData.seccion4_capacitado || false}
        onChange={(v) => updateField(4, 'capacitado', v)}
      />

      <Checkbox
        label="Certificados al día"
        checked={formData.seccion4_certificados || false}
        onChange={(v) => updateField(4, 'certificados', v)}
      />

      <Text style={styles.label}>Observaciones</Text>
      <Input
        value={formData.seccion4_observaciones || ''}
        onChangeText={(v) => updateField(4, 'observaciones', v)}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderSeccion5 = () => (
    <View>
      <Text style={styles.sectionTitle}>📦 Almacenamiento</Text>
      
      <Checkbox
        label="Heladera funcionando"
        checked={formData.seccion5_heladera || false}
        onChange={(v) => updateField(5, 'heladera', v)}
      />

      <Checkbox
        label="Freezer funcionando"
        checked={formData.seccion5_freezer || false}
        onChange={(v) => updateField(5, 'freezer', v)}
      />

      <Checkbox
        label="Alimentos rotulados"
        checked={formData.seccion5_rotulados || false}
        onChange={(v) => updateField(5, 'rotulados', v)}
      />

      <Checkbox
        label="Almacenamiento ordenado"
        checked={formData.seccion5_ordenado || false}
        onChange={(v) => updateField(5, 'ordenado', v)}
      />

      <Text style={styles.label}>Temperatura heladera (°C)</Text>
      <Input
        value={formData.seccion5_temp_heladera || ''}
        onChangeText={(v) => updateField(5, 'temp_heladera', v)}
        keyboardType="numeric"
      />
    </View>
  );

  const renderSeccion6 = () => (
    <View>
      <Text style={styles.sectionTitle}>👨‍🍳 Preparación</Text>
      
      <Checkbox
        label="Superficies limpias"
        checked={formData.seccion6_superficies || false}
        onChange={(v) => updateField(6, 'superficies', v)}
      />

      <Checkbox
        label="Utensilios adecuados"
        checked={formData.seccion6_utensilios || false}
        onChange={(v) => updateField(6, 'utensilios', v)}
      />

      <Checkbox
        label="Cocción correcta"
        checked={formData.seccion6_coccion || false}
        onChange={(v) => updateField(6, 'coccion', v)}
      />

      <Text style={styles.label}>Observaciones</Text>
      <Input
        value={formData.seccion6_observaciones || ''}
        onChangeText={(v) => updateField(6, 'observaciones', v)}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderSeccion7 = () => (
    <View>
      <Text style={styles.sectionTitle}>🍽️ Servicio</Text>
      
      <Checkbox
        label="Vajilla limpia"
        checked={formData.seccion7_vajilla || false}
        onChange={(v) => updateField(7, 'vajilla', v)}
      />

      <Checkbox
        label="Porciones adecuadas"
        checked={formData.seccion7_porciones || false}
        onChange={(v) => updateField(7, 'porciones', v)}
      />

      <Checkbox
        label="Temperatura correcta"
        checked={formData.seccion7_temperatura || false}
        onChange={(v) => updateField(7, 'temperatura', v)}
      />

      <Text style={styles.label}>Hora de servicio</Text>
      <Input
        value={formData.seccion7_hora || ''}
        onChangeText={(v) => updateField(7, 'hora', v)}
        placeholder="HH:MM"
      />
    </View>
  );

  const renderSeccion8 = () => (
    <View>
      <Text style={styles.sectionTitle}>♻️ Residuos</Text>
      
      <Checkbox
        label="Cestos con tapa"
        checked={formData.seccion8_cestos_tapa || false}
        onChange={(v) => updateField(8, 'cestos_tapa', v)}
      />

      <Checkbox
        label="Separación de residuos"
        checked={formData.seccion8_separacion || false}
        onChange={(v) => updateField(8, 'separacion', v)}
      />

      <Checkbox
        label="Área limpia"
        checked={formData.seccion8_area_limpia || false}
        onChange={(v) => updateField(8, 'area_limpia', v)}
      />

      <Text style={styles.label}>Observaciones</Text>
      <Input
        value={formData.seccion8_observaciones || ''}
        onChangeText={(v) => updateField(8, 'observaciones', v)}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderSeccion9 = () => (
    <View>
      <Text style={styles.sectionTitle}>📄 Documentación</Text>
      
      <Checkbox
        label="Libro de novedades"
        checked={formData.seccion9_libro || false}
        onChange={(v) => updateField(9, 'libro', v)}
      />

      <Checkbox
        label="Planillas de temperatura"
        checked={formData.seccion9_planillas || false}
        onChange={(v) => updateField(9, 'planillas', v)}
      />

      <Checkbox
        label="Certificados de personal"
        checked={formData.seccion9_certificados || false}
        onChange={(v) => updateField(9, 'certificados', v)}
      />

      <Checkbox
        label="Habilitaciones vigentes"
        checked={formData.seccion9_habilitaciones || false}
        onChange={(v) => updateField(9, 'habilitaciones', v)}
      />
    </View>
  );

  const renderSeccion10 = () => (
    <View>
      <Text style={styles.sectionTitle}>📝 Observaciones Finales</Text>
      
      <Text style={styles.label}>Aspectos positivos</Text>
      <Input
        value={formData.seccion10_positivos || ''}
        onChangeText={(v) => updateField(10, 'positivos', v)}
        multiline
        numberOfLines={4}
        placeholder="Describa los aspectos positivos..."
      />

      <Text style={styles.label}>Aspectos a mejorar</Text>
      <Input
        value={formData.seccion10_mejorar || ''}
        onChangeText={(v) => updateField(10, 'mejorar', v)}
        multiline
        numberOfLines={4}
        placeholder="Describa los aspectos a mejorar..."
      />

      <Text style={styles.label}>Recomendaciones</Text>
      <Input
        value={formData.seccion10_recomendaciones || ''}
        onChangeText={(v) => updateField(10, 'recomendaciones', v)}
        multiline
        numberOfLines={4}
        placeholder="Recomendaciones generales..."
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formulario de Relevamiento</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(seccionActual / 10) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Sección {seccionActual} de 10
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {SECCIONES.map((sec) => (
          <TouchableOpacity
            key={sec.id}
            style={[styles.tab, seccionActual === sec.id && styles.tabActive]}
            onPress={() => setSeccionActual(sec.id)}
          >
            <Text style={styles.tabIcon}>{sec.icon}</Text>
            <Text style={[styles.tabText, seccionActual === sec.id && styles.tabTextActive]}>
              {sec.id}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Card style={styles.formCard}>
          {renderSeccion()}
        </Card>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        {seccionActual > 1 && (
          <Button
            title="← Anterior"
            onPress={handleAnterior}
            variant="secondary"
          />
        )}
        <Button
          title={seccionActual === 10 ? 'Guardar' : 'Siguiente →'}
          onPress={handleSiguiente}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    color: colors.primary,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  progressContainer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },
  tabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  formCard: {
    margin: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});
