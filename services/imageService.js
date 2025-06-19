import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import { supabaseUrl } from '../constants';
import { supabase } from '../lib/supabase';


export const getUserImageSrc = imagePath => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    } else {
        return require('../assets/images/default_user.png');
    }
}

export const getSupabaseFileUrl = filePath => {
    if (filePath) {
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
    return null
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage, fileUri);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        let imageData = decode(fileBase64); // array buffer
        let { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*'
            });

        if (error) {
            console.log('file upload error:', error);
            return { success: false, msg: 'Could not upload media' };
        }

        return { success: true, data: data.path };
    } catch (error) {
        console.log('file upload error:', error);
        return { success: false, msg: 'Could not upload media' };
    }
}

export const getFilePath = (folderName, isImage, originalUri = null) => {
    // Try to preserve original extension if possible
    let ext = isImage ? '.png' : '.mp4';
    if (originalUri) {
        const match = originalUri.match(/\.([a-zA-Z0-9]+)$/);
        if (match) {
            ext = `.${match[1]}`;
        }
    }
    // Use timestamp + uuid.v4() for uniqueness
    const unique = `${Date.now()}-${uuid.v4()}`;
    return `${folderName}/${unique}${ext}`;
}