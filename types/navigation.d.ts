// This tells TypeScript that we are augmenting the '@react-navigation/stack' module
declare module '@react-navigation/stack' {
    // We are adding our custom 'screenIcons' property to the existing options
    export interface NativeStackNavigationOptions {
      screenIcons?: { [key: string]: string };
    }
  }
  
  // It's good practice to also augment the options for @react-navigation/native-stack if used
  declare module '@react-navigation/native-stack' {
    export interface NativeStackNavigationOptions {
      screenIcons?: { [key: string]: string };
    }
  }