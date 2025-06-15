// types/navigation.ts
export type RootStackParamList = {
    '(auth)': undefined;
    '(app)': undefined;
  };
  
  export type AuthStackParamList = {
    login: undefined;
    register: undefined;
    'reset-password': undefined;
  };
  
  export type AppStackParamList = {
    events: undefined;
    dashboard: undefined;
  };
  
  export type DashboardTabParamList = {
    '(home)': undefined;
    '(timeline)': undefined;
    '(shots)': undefined;
    '(other)': undefined;
    '(settings)': undefined;
  };