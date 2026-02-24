import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { app } from './config'

export const storage = getStorage(app)

export const uploadFile = async (path: string, file: File): Promise<string> => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const deleteFile = (path: string) => deleteObject(ref(storage, path))
