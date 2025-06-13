// // __tests__/auth/AuthService.test.ts
// import { AuthService } from '../../services/authService';
// import { auth, db } from '../../services/firebase';

// // Mock Firebase modules
// jest.mock('../../services/firebase', () => ({
//   auth: {
//     currentUser: null,
//   },
//   db: {},
// }));

// jest.mock('firebase/auth', () => ({
//   createUserWithEmailAndPassword: jest.fn(),
//   signInWithEmailAndPassword: jest.fn(),
//   signOut: jest.fn(),
//   sendPasswordResetEmail: jest.fn(),
//   updateProfile: jest.fn(),
//   onAuthStateChanged: jest.fn(),
// }));

// jest.mock('firebase/firestore', () => ({
//   doc: jest.fn(),
//   setDoc: jest.fn(),
//   getDoc: jest.fn(),
//   updateDoc: jest.fn(),
//   serverTimestamp: jest.fn(),
// }));

// describe('AuthService', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('signUp', () => {
//     it('should create a new user account successfully', async () => {
//       const mockUser = {
//         uid: 'test-uid',
//         email: 'test@example.com',
//         displayName: 'Test User',
//         photoURL: null,
//       };

//       const mockUserCredential = {
//         user: mockUser,
//       };

//       require('firebase/auth').createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
//       require('firebase/auth').updateProfile.mockResolvedValue(undefined);
//       require('firebase/firestore').setDoc.mockResolvedValue(undefined);

//       const result = await AuthService.signUp('test@example.com', 'password123', 'Test User');

//       expect(result).toMatchObject({
//         id: 'test-uid',
//         email: 'test@example.com',
//         displayName: 'Test User',
//       });
//     });

//     it('should handle sign up errors correctly', async () => {
//       const mockError = {
//         code: 'auth/email-already-in-use',
//         message: 'Email already in use',
//       };

//       require('firebase/auth').createUserWithEmailAndPassword.mockRejectedValue(mockError);

//       await expect(AuthService.signUp('test@example.com', 'password123')).rejects.toMatchObject({
//         code: 'auth/email-already-in-use',
//         userMessage: 'An account with this email already exists.',
//       });
//     });
//   });

//   describe('signIn', () => {
//     it('should sign in user successfully', async () => {
//       const mockUser = {
//         uid: 'test-uid',
//         email: 'test@example.com',
//         displayName: 'Test User',
//         photoURL: null,
//       };

//       const mockUserCredential = {
//         user: mockUser,
//       };

//       const mockUserDoc = {
//         exists: () => true,
//         data: () => ({
//           id: 'test-uid',
//           email: 'test@example.com',
//           displayName: 'Test User',
//           createdAt: { toDate: () => new Date() },
//           updatedAt: { toDate: () => new Date() },
//         }),
//       };

//       require('firebase/auth').signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);
//       require('firebase/firestore').getDoc.mockResolvedValue(mockUserDoc);

//       const result = await AuthService.signIn('test@example.com', 'password123');

//       expect(result).toMatchObject({
//         id: 'test-uid',
//         email: 'test@example.com',
//         displayName: 'Test User',
//       });
//     });

//     it('should handle invalid credentials', async () => {
//       const mockError = {
//         code: 'auth/wrong-password',
//         message: 'Wrong password',
//       };

//       require('firebase/auth').signInWithEmailAndPassword.mockRejectedValue(mockError);

//       await expect(AuthService.signIn('test@example.com', 'wrongpassword')).rejects.toMatchObject({
//         code: 'auth/wrong-password',
//         userMessage: 'Incorrect password. Please try again.',
//       });
//     });
//   });

//   describe('signOut', () => {
//     it('should sign out user successfully', async () => {
//       require('firebase/auth').signOut.mockResolvedValue(undefined);

//       await expect(AuthService.signOut()).resolves.toBeUndefined();
//     });
//   });

//   describe('resetPassword', () => {
//     it('should send password reset email successfully', async () => {
//       require('firebase/auth').sendPasswordResetEmail.mockResolvedValue(undefined);

//       await expect(AuthService.resetPassword('test@example.com')).resolves.toBeUndefined();
//     });

//     it('should handle invalid email for password reset', async () => {
//       const mockError = {
//         code: 'auth/user-not-found',
//         message: 'User not found',
//       };

//       require('firebase/auth').sendPasswordResetEmail.mockRejectedValue(mockError);

//       await expect(AuthService.resetPassword('nonexistent@example.com')).rejects.toMatchObject({
//         code: 'auth/user-not-found',
//         userMessage: 'No account found with this email address.',
//       });
//     });
//   });
// });