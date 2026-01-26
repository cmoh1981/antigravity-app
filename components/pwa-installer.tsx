import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Only run on web
    if (Platform.OS !== 'web') return;

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after 30 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    
    // Show again after 3 days
    const dismissTime = Date.now();
    localStorage.setItem('pwaInstallDismissed', dismissTime.toString());
  };

  // Don't show if not web, already installed, or no prompt available
  if (Platform.OS !== 'web' || isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.iconContainer}>
          <IconSymbol name="arrow.down.circle.fill" size={32} color="#4A90D9" />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>앱 설치하기</Text>
          <Text style={styles.description}>
            홈 화면에 추가하고 오프라인에서도 사용하세요
          </Text>
        </View>

        <View style={styles.buttons}>
          <Pressable 
            style={styles.installButton}
            onPress={handleInstallClick}
          >
            <Text style={styles.installButtonText}>설치</Text>
          </Pressable>
          
          <Pressable 
            style={styles.dismissButton}
            onPress={handleDismiss}
          >
            <IconSymbol name="xmark" size={20} color="#8E8E93" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'fixed' as any,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 16,
  },
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installButton: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 8,
  },
});
