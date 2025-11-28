import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { useRouter } from 'expo-router';


export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const router = useRouter();
  const features = [
    {
      icon: 'link-outline',
      name: 'URL & Links',
      color: '#6366F1',
      description: 'Generate QR codes for websites and social media'
    },
    {
      icon: 'document-text-outline',
      name: 'Text & Notes',
      color: '#10B981',
      description: 'Encode plain text or important information'
    },
    {
      icon: 'wifi-outline',
      name: 'WiFi Access',
      color: '#F59E0B',
      description: 'Share WiFi credentials with a simple scan'
    },
    {
      icon: 'card-outline',
      name: 'Payments',
      color: '#EF4444',
      description: 'Create QR codes for payments'
    },
    {
      icon: 'person-circle-outline',
      name: 'Contact Cards',
      color: '#8B5CF6',
      description: 'Share contact information instantly'
    },
    {
      icon: 'color-palette-outline',
      name: 'Custom Designs',
      color: '#EC4899',
      description: 'Brand your QR codes with colors'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Users' },
    { number: '2M+', label: 'Codes' },
    { number: '99.8%', label: 'Success' },
    { number: '4.9★', label: 'Rating' }
  ];

  const testimonials = [
    {
      name: 'Zakayo Simon',
      role: 'Director At Arusha prime Design',
      text: 'QR Nexus revolutionized our event marketing!',
      rating: 3
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Cafe Owner',
      text: 'WiFi QR codes saved us so much time.',
      rating: 4
    }
  ];

  const openWebsite = () => {
    Linking.openURL('https://nkote.netlify.app');
  };

  const openConsultation = () => {
    Linking.openURL('mailto:nexa.theicon@gmail.com');
  };

  const handlePhonePress = () => {
      Linking.openURL(`tel:+255 622 255 496`);
    
  };

  const handleLinkedInPress = () => {
      Linking.openURL("https://linkedin.com/in/paulpaul");
  };

  const handleGitHubPress = () => {
      Linking.openURL('https://github.com/pau49');
  };

  const handleTelegramPress = () => {
      Linking.openURL(`https://t.me/makimonsa`);
  };

   const handleWhatsappPress = () => {

      Linking.openURL(`https://wa.me/qr/FANA6JCLXH3YL1`);
  };

       const handleLocationPress = () => {
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=Arusha, Tanzania`);
    };
        const handlecontactmePress = () => {
        Linking.openURL('https://nkote.netlify.app/contactme');
    };
        const handleaboutPress = () => {
        Linking.openURL('https://nkote.netlify.app/about');
    };


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Content Container */}
      <View style={[styles.contentContainer, isWideScreen && styles.contentContainerWide]}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="qr-code-outline" size={isWideScreen ? 52 : 44} color="#6366F1" />
            <View style={styles.logoText}>
              <Text style={[styles.title, isWideScreen && styles.titleWide]}>QR Hub</Text>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>PRO</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.subtitle, isWideScreen && styles.subtitleWide]}>
            Generate, scan, and track QR codes in seconds
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Ionicons name="star-half" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>4.5 (12K reviews)</Text>
          </View>
        </View>

        {/* Stats - Always horizontal but responsive */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Main CTA Buttons */}
        <View style={styles.heroButtons}>
          <TouchableOpacity style={[styles.primaryButton, isWideScreen && styles.buttonWide]} onPress={() => router.push('/generate')}>
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Create Qr Code Now !</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, isWideScreen && styles.buttonWide]}>
            <Ionicons name="play" size={18} color="#6366F1" />
            <Text style={styles.secondaryButtonText}>Watch Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isWideScreen && styles.sectionTitleWide]}>Everything You Need</Text>
          <Text style={[styles.sectionSubtitle, isWideScreen && styles.sectionSubtitleWide]}>
            Generate and customize QR codes for any use case
          </Text>
          <View style={[styles.featuresGrid, isWideScreen && styles.featuresGridWide]}>
            {features.map((feature, index) => (
              <View key={index} style={[styles.featureCard, isWideScreen && styles.featureCardWide]}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.name}</Text>
                <Text style={styles.featureText}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isWideScreen && styles.sectionTitleWide]}>Loved by Businesses</Text>
          <View style={[styles.testimonials, isWideScreen && styles.testimonialsWide]}>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={[styles.testimonialCard, isWideScreen && styles.testimonialCardWide]}>
                <View style={styles.testimonialHeader}>
                  <View>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                  </View>
                  <View style={styles.rating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Ionicons key={i} name="star" size={14} color="#F59E0B" />
                    ))}
                  </View>
                </View>
                <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Consultation */}
        <View style={[styles.consultationSection, isWideScreen && styles.consultationSectionWide]}>
          <Ionicons name="business" size={isWideScreen ? 48 : 40} color="#fff" />
          <Text style={[styles.consultationTitle, isWideScreen && styles.consultationTitleWide]}>
            Enterprise Solutions?
          </Text>
          <Text style={[styles.consultationText, isWideScreen && styles.consultationTextWide]}>
            Free consultation for bulk QR codes and custom branding
          </Text>
          <TouchableOpacity style={styles.consultationButton} onPress={openConsultation}>
            <Ionicons name="calendar-outline" size={18} color="#6366F1" />
            <Text style={styles.consultationButtonText}>Booking &&  <Ionicons name='chatbubble-ellipses-outline' size={18} color="#6366F1"/> Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerContent, isWideScreen && styles.footerContentWide]}>
            <View style={[styles.footerBrand, isWideScreen && styles.footerBrandWide]}>
              <View style={styles.footerLogo}>
                <Ionicons name="qr-code-outline" size={28} color="#6366F1" />
                <Text style={styles.footerTitle}>QR Hub</Text>
              </View>
              <Text style={styles.footerDescription}>
                Complete QR code solution for personal and Businesses activities.
              </Text>
              <View style={styles.socialLinks}>
                <TouchableOpacity style={styles.socialButton} onPress={handleTelegramPress}>
                  <FontAwesome name="telegram" size={18} color="#0088cc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleLinkedInPress}>
                  <Ionicons name="logo-linkedin" size={18} color="#0088cc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleGitHubPress}>
                  <Ionicons name="logo-github" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleWhatsappPress}>
                  <Ionicons name="logo-whatsapp" size={18} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleLocationPress}>
                  <FontAwesome name="map-marker" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.footerLinks, isWideScreen && styles.footerLinksWide]}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Product</Text>
                <TouchableOpacity><Text style={styles.footerLink}>Features</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Pricing</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>API</Text></TouchableOpacity>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Resources</Text>
                <TouchableOpacity><Text style={styles.footerLink}>Docs</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLink}>Blog</Text></TouchableOpacity>
                <TouchableOpacity  onPress={handlecontactmePress}><Text style={styles.footerLink}>Support</Text></TouchableOpacity>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>Company</Text>
                <TouchableOpacity onPress={handleaboutPress}><Text style={styles.footerLink}>About</Text></TouchableOpacity>
                <TouchableOpacity onPress={handlecontactmePress}><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
                <TouchableOpacity onPress={openWebsite}><Text style={styles.footerLink}>Website</Text></TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.footerBottom, isWideScreen && styles.footerBottomWide]}>
            <Text style={styles.copyright}>© 2025 QR Hub. All rights reserved.</Text>
            <View style={styles.legalLinks}>
              <TouchableOpacity onPress={() => router.push('/terms')}><Text style={styles.legalLink}>Privacy & Terms & Conditions</Text></TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    width: '100%',
    minHeight: '100%',
    padding: 16,
  },
  contentContainerWide: {
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  titleWide: {
    fontSize: 36,
  },
  logoBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  subtitleWide: {
    fontSize: 18,
    maxWidth: 400,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingText: {
    marginLeft: 6,
    color: '#64748B',
    fontWeight: '500',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  heroButtons: {
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
  },
  buttonWide: {
    maxWidth: 250,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionTitleWide: {
    fontSize: 32,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 300,
    alignSelf: 'center',
    lineHeight: 20,
  },
  sectionSubtitleWide: {
    fontSize: 16,
    maxWidth: 400,
  },
  featuresGrid: {
    gap: 12,
  },
  featuresGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  featureCardWide: {
    width: '30%',
    minWidth: 200,
    maxWidth: 250,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1E293B',
    textAlign: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  testimonials: {
    gap: 16,
  },
  testimonialsWide: {
    flexDirection: 'row',
    gap: 20,
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  testimonialCardWide: {
    flex: 1,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  testimonialRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  consultationSection: {
    backgroundColor: '#6366F1',
    marginVertical: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  consultationSectionWide: {
    padding: 40,
  },
  consultationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  consultationTitleWide: {
    fontSize: 24,
  },
  consultationText: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
    maxWidth: 300,
  },
  consultationTextWide: {
    fontSize: 16,
    maxWidth: 400,
  },
  consultationButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  consultationButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  footer: {
    backgroundColor: '#1E293B',
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  footerContent: {
    padding: 24,
  },
  footerContentWide: {
    flexDirection: 'row',
    padding: 40,
  },
  footerBrand: {
    marginBottom: 24,
  },
  footerBrandWide: {
    flex: 1,
    marginRight: 40,
    marginBottom: 0,
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
    maxWidth: 250,
  },
  socialLinks: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  footerLinksWide: {
    flex: 2,
    justifyContent: 'space-between',
    gap: 0,
  },
  footerColumn: {
    minWidth: 100,
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    padding: 16,
    alignItems: 'center',
  },
  footerBottomWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  copyright: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
  },
  legalLink: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 16,
  },
});