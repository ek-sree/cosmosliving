import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '@/src/components/ui/CustomDrawer';
import { useAuth } from '@/src/context/AuthContext';

export default function DrawerLayout() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: '70%',
          backgroundColor: 'transparent', 
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.7)',
        headerStyle: {
          backgroundColor: '#302b63',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen 
        name="property" 
        options={{ 
          title: 'Properties',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShown: true 
        
        }} 
      />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
      <Drawer.Screen name="profile" options={{ title: 'Profile',headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShown: true 
         }} />
      <Drawer.Screen name="my-bookings" options={{ title: 'My Reserve', }} />
      <Drawer.Screen 
        name="(auth)/login" 
        options={{ 
          title: 'Login',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShown: true 
        }} 
      />
    </Drawer>
  );
}