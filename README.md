
# FirebaseImageUpload

This application allows users to upload, preview, and manage images using a simple and intuitive interface. Users can upload images by drap-and-drop or by simplying uploading them, and delete images directly. The images are stored in Firebase Storage, and metadata (such as the image URL) is saved in Firebase Firestore. The app also features a progress bar for uploads and toast notifications for feedback.

## Design Choices

#### 1. React-Dropzone for Uploads: 
Was chosen for its flexible drag-and-drop functionality, which simplifies the user experience when selecting images.

#### 2. React-Toastify for Notifications
Was used to display user-friendly notifications (success/error) when uploading, deleting, or performing any action. 

#### 3. Simple and Clean Layout
The UI is intentionally designed to be minimalistic and easy to navigate, focusing on the core functionality of uploading, managing, and deleting images. 

#### 4. Image Preview and Progress Indicator
After selecting an image, the UI immediately displays a thumbnail preview along with a progress bar that tracks the upload process. This real-time feedback gives users a clear idea of what’s happening, reducing uncertainty while waiting for an upload to complete.

#### 5. Hover Actions for Deleting Images
When users hover over an image, a delete button (a trash icon) appears as an overlay on the image card. This keeps the UI clean by not cluttering each image with too many controls.

#### 6. Toast Notifications for Feedback
Instead of showing pop-up dialogs or alerts that interrupt the flow, toast notifications appear subtly in a corner of the screen to inform users about successful or failed uploads, deletions, and other actions.


## Challenges

#### 1. Handling Image Uploads and Storage
Initially, integrating Firebase Storage with real-time upload progress tracking was tricky. However, the use of ```uploadBytesResumable``` allowed for tracking progress effectively and providing visual feedback through a progress bar.

#### 2. Deleting Images
Deleting images involved two steps: removing the file from Firebase Storage and deleting the corresponding metadata from Firestore. Ensuring both operations occurred without errors was critical.
## Extra Features

#### 1. Progress Feedback
A progress bar was added to give users feedback while their images were being uploaded. This feature enhances user experience by keeping users informed about the state of their uploads.

#### 2. Notifications
The addition of react-toastify notifications improved user feedback by notifying them of successful or failed operations, making the app more interactive and informative.

## Getting Started

#### Prerequisites
Node.js (version 14.x or higher)

Firebase account (set up Firestore and Storage)

#### Installation
#### 1. Clone the repository:

```https://github.com/Simran2147/FirebaseImageUpload.git```

```cd FirebaseImageUpload```

#### 2. Install dependencies:

```npm install```

#### 3. Configure Firebase:
Go to the Firebase console and create a new project.

Set up Firestore and Firebase Storage in the Firebase project.

Create a ```firebase-config.js``` file in the ```src``` folder with your Firebase configuration.

#### 4. Run the application:
```npm run dev```
