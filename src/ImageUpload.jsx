import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ImageUpload.css'; // Add a CSS file for custom styling
import { db, storage } from './firebase-config';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch uploaded images from Firestore
  const fetchUploadedImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'images'));
      const images = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUploadedImages(images);
    } catch (error) {
      console.error('Error fetching images: ', error);
      toast.error('Error fetching images');
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0];
      setImage(selectedImage);
      setPreviewUrl(URL.createObjectURL(selectedImage));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!image) {
      toast.error('No image selected');
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressPercentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercentage);
      },
      (error) => {
        console.error('Error uploading image: ', error);
        toast.error('Error uploading image');
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save the image URL in Firestore
          const docRef = await addDoc(collection(db, 'images'), {
            name: image.name,
            url: downloadURL,
          });

          await fetchUploadedImages(); // Ensure to wait for the fetch to complete

          // Show a success toast with the image name
          toast.success(`Image "${image.name}" uploaded successfully!`);

          // Reset image and previewUrl to show the dropzone again
          setImage(null);
          setPreviewUrl("");
          setProgress(0);
        } catch (error) {
          console.error('Error saving image URL to Firestore: ', error);
          toast.error('Error saving image URL');
        }
      }
    );
  };

  const handleDelete = async (id, imageUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'images', id));

      // Delete from Firebase Storage
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);

      toast.success('Image deleted successfully!');
      fetchUploadedImages(); // Refetch images after deletion
    } catch (error) {
      console.error('Error deleting image: ', error);
      toast.error('Error deleting image');
    }
  };

  // Handle the reordering of images
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(uploadedImages);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    setUploadedImages(reorderedImages);
  };

  return (
    <div>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
        
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select one</p>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p>Image Preview:</p>
          <img src={previewUrl} alt="Preview" style={{ width: '150px', height: 'auto' }} />
        </div>
      )}

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={!image}>
        Upload
      </button>
      <br></br>
      {/* Progress Bar */}
      {progress > 0 && (
        <div style={{ width: '100%', backgroundColor: '#ccc', marginTop: '20px' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '10px',
              backgroundColor: progress === 100 ? 'green' : 'blue',
            }}
          ></div>
        </div>
      )}

      <br></br>

      {/* Uploaded Images in Card Layout with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div
              className="image-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {uploadedImages.length === 0 ? (
                <p>No images uploaded yet.</p>
              ) : (
                uploadedImages.map((img, index) => (
                  <Draggable key={img.id} draggableId={img.id} index={index}>
                    {(provided) => (
                      <div
                        className="image-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="image-wrapper">
                          <img
                            src={img.url}
                            alt={img.name}
                            style={{ width: '100%', height: 'auto' }}
                          />
                          <div className="overlay">
                            <p className="image-name">{img.name}</p>
                            <div
                              className="delete-icon"
                              onClick={() => handleDelete(img.id, img.url)}
                            >
                              {/* Inline SVG for Trash Can Icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20px"
                                height="20px"
                                fill="#ff4d4f"
                              >
                                <path d="M3 6l3 18h12l3-18H3zm3 2h12l-1 1H7l-1-1zm3-4h6v2H9V4zM5 4h14c1.1 0 2 .9 2 2v2H3V6c0-1.1.9-2 2-2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default ImageUpload;
