import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  Image,
  Modal,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'qrcode';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { notifyMe } from './notify';

export default function QRGenerator() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('url');
  const [generatedQR, setGeneratedQR] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customization, setCustomization] = useState({
    color: '#000000',
    bgColor: '#FFFFFF',
    size: 200,
    margin: 5,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const colorOptions = ["#4F46E5","#3730A3",'#1e3a8a','#ea1010ff', '#EF4444','#000000','#7c3aed', '#0dda39ff','#10B981', '#F59E0B','#c600d5a4', '#8B5CF6', '#EC4899', '#06B6D4',
  ];

  const bgColorOptions = [
    '#FFFFFF', '#F8FAFC', '#FEF3C7', '#E0E7FF', '#DCFCE7', '#FCE7F3', '#FFEDD5', '#E0F2FE'
  ];

  const [formData, setFormData] = useState({
    url: { url: '' },
    text: { text: '' },
    wifi: { ssid: '', password: '', encryption: 'WPA' },
    payment: { upiId: '', amount: '', note: '' },
    contact: { name: '', phone: '', email: '', company: '', title: '' }
  });

  const qrTypes = [
    { id: 'url', icon: 'link', name: 'URL', color: '#6366F1' },
    { id: 'text', icon: 'document-text', name: 'Text', color: '#10B981' },
    { id: 'wifi', icon: 'wifi', name: 'WiFi', color: '#F59E0B' },
    { id: 'payment', icon: 'card', name: 'Payment', color: '#EF4444' },
    { id: 'contact', icon: 'person-circle', name: 'Contact', color: '#8B5CF6' }
  ];

  const generateQRString = () => {
    const data = formData[activeTab];
    
    switch(activeTab) {
      case 'url':
        return data.url;
      case 'text':
        return data.text;
      case 'wifi':
      const cleanSsid = data.ssid.replace(/[;:"\\]/g, '');
      const cleanPassword = data.password ? data.password.replace(/[;:"\\]/g, '') : '';
      
      if (data.encryption === 'nopass') {
        return `WIFI:S:${cleanSsid};T:nopass;;`;
      } else {
        const encType = data.encryption === 'WEP' ? 'WEP' : 'WPA';
        return `WIFI:S:${cleanSsid};T:${encType};P:${cleanPassword};;`;
      }
   case 'payment':
    return `https://www.paypal.com/paypalme/${data.upiId}?amount=${data.amount || ''}&note=${encodeURIComponent(data.note || '')}`;

      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTEL:${data.phone}\nEMAIL:${data.email}\nORG:${data.company}\nEND:VCARD`;
      default:
        return '';
    }
  };

  const validateForm = () => {
    const data = formData[activeTab];
    
    switch(activeTab) {
      case 'url':
        return data.url && data.url.includes('.');
      case 'text':
        return data.text.trim().length > 0;
      case 'wifi':
        // Only require password if encryption is not 'nopass'
        return data.ssid.trim().length > 0 && 
               (data.encryption === 'nopass' || data.password.trim().length > 0);
      case 'payment':
        return data.upiId && data.upiId.includes('@');
      case 'contact':
        return data.name.trim().length > 0 && (data.phone || data.email);
      default:
        return false;
    }
  };

  const generateQRCode = async () => {
    if (!validateForm()) {
      notifyMe('Incomplete Data', 'Please fill in all required fields.');
      return;
    }

    try {
      const qrString = generateQRString();
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: customization.size,
        margin: customization.margin,
        color: {
          dark: customization.color,
          light: customization.bgColor
        }
      });
      
      setGeneratedQR(qrCodeDataURL);
      setShowCustomization(true);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
      
    } catch (error) {
      notifyMe('Error', 'Failed to generate QR code. Please try again.');
      console.error('QR Generation Error:', error);
    }
  };

  // Regenerate QR code when customization changes
  const updateCustomization = async (updates) => {
    const newCustomization = { ...customization, ...updates };
    setCustomization(newCustomization);

    try {
      const qrString = generateQRString();
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: newCustomization.size,
        margin: newCustomization.margin,
        color: {
          dark: newCustomization.color,
          light: newCustomization.bgColor
        }
      });
      
      setGeneratedQR(qrCodeDataURL);
    } catch (error) {
      console.error('QR Regeneration Error:', error);
    }
  };

  const downloadQRCode = async () => {
    if (!generatedQR) return;

    try {
      if (Platform.OS === 'web') {
        // Web download
        const link = document.createElement('a');

       
        link.href = generatedQR;
        link.download = `Qr Hub-${activeTab}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Mobile - save to gallery
        const { status } = await MediaLibrary.requestPermissionsAsync();
        
        if (status !== 'granted') {
          notifyMe('Permission required', 'Please grant permission to save images.');
          return;
        }

        const filename = `QR Hub_${new Date()}.png`;
        const base64Data = generatedQR.split(',')[1];
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
        
        notifyMe('Success', 'QR code saved to your gallery!');
      }
      
      // Close modal after download
      closeCustomizationModal();
    } catch (error) {
      notifyMe('Error', 'Failed to save QR code.');
      console.error('Download Error:', error);
    }
  };

  const closeCustomizationModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowCustomization(false);
    });
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const updateWiFiEncryption = (encryption) => {
    setFormData(prev => ({
      ...prev,
      wifi: {
        ...prev.wifi,
        encryption,
        ...(encryption === 'nopass' && { password: '' })
      }
    }));
  };

  const renderForm = () => {
    const data = formData[activeTab];

    switch(activeTab) {
      case 'url':
        return (
          <View style={styles.form}>
            <Text style={styles.label}>Website URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              placeholderTextColor={'#777'}
              value={data.url}
              onChangeText={(text) => updateFormData('url', text)}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        );

      case 'text':
        return (
          <View style={styles.form}>
            <Text style={styles.label}>Text Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your text, note, or message..."
              placeholderTextColor={'#777'}
              value={data.text}
              onChangeText={(text) => updateFormData('text', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        );

      case 'wifi':
        return (
          <View style={styles.form}>
            <Text style={styles.label}>Network Name (SSID) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your WiFi name"
              placeholderTextColor={'#777'}
              value={data.ssid}
              onChangeText={(text) => updateFormData('ssid', text)}
            />
            
            <Text style={styles.label}>Encryption Type</Text>
            <View style={styles.radioGroup}>
              {['WPA', 'WEP', 'nopass'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioOption}
                  onPress={() => updateWiFiEncryption(type)}
                >
                  <View style={[
                    styles.radioCircle,
                    data.encryption === type && { borderColor: '#6366F1' }
                  ]}>
                    {data.encryption === type && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Conditionally render password field only when encryption is NOT 'nopass' */}
            {data.encryption !== 'nopass' && (
              <>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="WiFi password"
                  placeholderTextColor={'#777'}     
                  value={data.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry
                />
              </>
            )}
          </View>
        );

case 'payment':
  return (
    <View style={styles.form}>
      <Text style={styles.label}>PayPal Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="example@paypal.com"
        placeholderTextColor={'#777'}
        value={data.upiId}
        onChangeText={(text) => updateFormData('upiId', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Amount *</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        placeholderTextColor={'#777'}
        value={data.amount}
        onChangeText={(text) => updateFormData('amount', text)}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Payment Note (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Payment for services"
        placeholderTextColor={'#777'}
        value={data.note}
        onChangeText={(text) => updateFormData('note', text)}
      />
    </View>
  );


      case 'contact':
        return (
          <View style={styles.form}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
             placeholderTextColor={'#777'}
              value={data.name}
              onChangeText={(text) => updateFormData('name', text)}
            />
            
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+255 123 456 789"
              placeholderTextColor={'#777'}
              value={data.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="YourName@example.com"
              placeholderTextColor={'#777'}
              value={data.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Company Name"
               placeholderTextColor={'#777'}
              value={data.company}
              onChangeText={(text) => updateFormData('company', text)}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const ColorPicker = ({ title, colors, selectedColor, onSelect }) => (
    <View style={styles.colorPicker}>
      <Text style={styles.colorPickerTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.colorScroll}
      >
        <View style={styles.colorOptions}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorOptionSelected
              ]}
              onPress={() => onSelect(color)}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView 
        style={[
          styles.content, 
          showCustomization && styles.contentBlurred
        ]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.innerContent, isWideScreen && styles.innerContentWide]}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#6366F1" />
            </TouchableOpacity>
            <Text style={styles.title}>QR Code Generator</Text>
            <Text style={styles.subtitle}>Create custom QR codes for any purpose</Text>
          </View>

          {/* Main Content */}
          <View style={[styles.main, isWideScreen && styles.mainWide]}>
            
            {/* Left Panel - Input Form */}
            <View style={[styles.leftPanel, isWideScreen && styles.leftPanelWide]}>
              
              {/* QR Type Selection */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.tabScroll}
              >
                <View style={styles.tabs}>
                  {qrTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.tab,
                        activeTab === type.id && [styles.tabActive, { borderColor: type.color }]
                      ]}
                      onPress={() => setActiveTab(type.id)}
                    >
                      <Ionicons 
                        name={type.icon} 
                        size={20} 
                        color={activeTab === type.id ? '#FFFFFF' : type.color} 
                      />
                      <Text style={[
                        styles.tabText,
                        activeTab === type.id && styles.tabTextActive
                      ]}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Dynamic Form */}
              {renderForm()}

              {/* Generate Button */}
              <TouchableOpacity 
                style={[styles.generateButton, !validateForm() && styles.generateButtonDisabled]}
                onPress={generateQRCode}
                disabled={!validateForm()}
              >
                <Ionicons name="qr-code" size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Customization Modal */}
      <Modal
        visible={showCustomization}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeCustomizationModal}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Qr Hub</Text>
              <Text style={styles.modalSubtitle}>Preview and customize before downloading</Text>
            </View>

            {/* QR Preview */}
            <View style={styles.modalPreview}>
              <View style={[
                styles.qrContainer,
                { backgroundColor: customization.bgColor }
              ]}>
                {generatedQR && (
                  <Image 
                    source={{ uri: generatedQR }} 
                    style={[
                      styles.qrImage,
                      { width: customization.size, height: customization.size }
                    ]}
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>

            {/* Customization Options */}
            <ScrollView style={styles.customizationSection} showsVerticalScrollIndicator={false}>
              {/* QR Color Picker */}
              <ColorPicker
                title="QR Code Color"
                colors={colorOptions}
                selectedColor={customization.color}
                onSelect={(color) => updateCustomization({ color })}
              />

              {/* Background Color Picker */}
              <ColorPicker
                title="Background Color"
                colors={bgColorOptions}
                selectedColor={customization.bgColor}
                onSelect={(color) => updateCustomization({ bgColor: color })}
              />

              {/* Size Options */}
              <View style={styles.sizeSection}>
                <Text style={styles.sizeTitle}>QR Code Size</Text>
                <View style={styles.sizeOptions}>
                  {[150, 200, 250, 300, 350].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeOption,
                        customization.size === size && styles.sizeOptionSelected
                      ]}
                      onPress={() => updateCustomization({ size })}
                    >
                      <Text style={[
                        styles.sizeOptionText,
                        customization.size === size && styles.sizeOptionTextSelected
                      ]}>
                        {size}px
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Download Button */}
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={downloadQRCode}
              >
                <Ionicons name="download" size={20} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>
                  {Platform.OS === 'web' ? 'Download QR Code' : 'Save to Gallery'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  contentBlurred: {
    opacity: 0.3,
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
  innerContentWide: {
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  main: {
    gap: 20,
  },
  mainWide: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  },
  leftPanel: {
    flex: 1,
  },
  leftPanelWide: {
    flex: 1,
    maxWidth: 500,
  },
  tabScroll: {
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
  generateButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  modalPreview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  qrImage: {
    borderRadius: 8,
  },
  customizationSection: {
    maxHeight: 300,
  },
  colorPicker: {
    marginBottom: 20,
  },
  colorPickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  colorScroll: {
    marginHorizontal: -4,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  sizeOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sizeOptionTextSelected: {
    color: '#FFFFFF',
  },
  downloadButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});