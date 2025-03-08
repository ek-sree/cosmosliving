import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomDrawerContent(props) {
  const { isAuthenticated, setIsAuthenticated, navigation } = props;
  const router = useRouter();
  const currentPath = usePathname();
  const insets = useSafeAreaInsets();

  const handleNavigation = (route) => {
    router.push(route);
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      navigation.closeDrawer();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Enhanced route checking to properly detect active routes
  const isRouteActive = (route) => {
    // Extract the route name for comparison
    const routeParts = route.split('/');
    const routeName = routeParts[routeParts.length - 1];
    
    // Check if currentPath contains the route name
    return currentPath === route || 
           currentPath.includes(routeName) || 
           (routeName === 'property' && currentPath === '/');
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientContainer, { paddingTop: insets.top }]}
    >
      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.drawerContainer}
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.closeButtonContainer}
            onPress={() => navigation.closeDrawer()}
          >
            <Feather name="x" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {isAuthenticated && (
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#ff9966', '#ff5e62']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>P</Text>
              </LinearGradient>
            </View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.menuContainer}>
          <MenuItem 
            icon="home" 
            label="Properties" 
            onPress={() => handleNavigation('/(drawer)/property')} 
            isActive={isRouteActive('/(drawer)/property')}
          />
          
          <MenuItem 
            icon="info" 
            label="About" 
            onPress={() => handleNavigation('/(drawer)/about')} 
            isActive={isRouteActive('/(drawer)/about')}
          />

          {isAuthenticated ? (
            <>
              <MenuItem 
                icon="user" 
                label="Profile" 
                onPress={() => handleNavigation('/(drawer)/profile')} 
                isActive={isRouteActive('/(drawer)/profile')}
              />
              
              <MenuItem 
                icon="calendar" 
                label="My Reserve" 
                onPress={() => handleNavigation('/(drawer)/my-booking')} 
                isActive={isRouteActive('/(drawer)/my-booking')}
              />
              
              <View style={styles.spacer} />
              
              <MenuItem 
                icon="log-out" 
                label="Logout" 
                onPress={handleLogout} 
                isLogout 
              />
            </>
          ) : (
            <MenuItem 
              icon="log-in" 
              label="Login" 
              onPress={() => handleNavigation('/(auth)/login')} 
              highlight 
              isActive={isRouteActive('/(auth)/login')}
            />
          )}
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

function MenuItem({ icon, label, onPress, isLogout, highlight, isActive }) {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        highlight && styles.highlightMenuItem,
        isLogout && styles.logoutMenuItem,
        isActive && styles.activeMenuItem
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.menuIconContainer,
        isActive && styles.activeIconContainer
      ]}>
        <Feather 
          name={icon} 
          size={18} 
          color={
            isActive ? "#fff" :
            highlight ? "#fff" : 
            isLogout ? "#ff5e62" : 
            "#e0e0e0"
          } 
        />
      </View>
      <Text style={[
        styles.menuText,
        highlight && styles.highlightMenuText,
        isLogout && styles.logoutMenuText,
        isActive && styles.activeMenuText
      ]}>
        {label}
      </Text>
      
      {isActive && (
        <View style={styles.activeIndicator} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logo: {
    height: 30,
    width: 150,
  },
  closeButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuText: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  highlightMenuItem: {
    backgroundColor: 'rgba(255,94,98,0.2)',
  },
  highlightMenuText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutMenuItem: {
    borderWidth: 1,
    borderColor: 'rgba(255,94,98,0.3)',
  },
  logoutMenuText: {
    color: '#ff5e62',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -8 }],
    width: 4,
    height: 16,
    backgroundColor: '#ff5e62',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  spacer: {
    height: 20,
  },
});