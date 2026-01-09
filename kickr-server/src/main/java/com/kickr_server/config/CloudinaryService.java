package com.kickr_server.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${CLOUDINARY_CLOUD_NAME}") String cloudName,
            @Value("${CLOUDINARY_API_KEY}") String apiKey,
            @Value("${CLOUDINARY_API_SECRET}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    /**
     * Uploads an image to Cloudinary with automatic optimization.
     *
     * @param file the image file to upload
     * @return a map containing the upload results (including url and public_id)
     * @throws IOException if the upload fails
     */
    public Map<String, Object> upload(MultipartFile file) throws IOException {
        return (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "kickr/avatars",
                "transformation", "c_fill,g_face,w_400,h_400,f_auto,q_auto"));
    }

    /**
     * Deletes an image from Cloudinary by its public ID.
     *
     * @param publicId the public ID of the image to delete
     * @return a map containing the deletion result
     * @throws IOException if the deletion fails
     */
    public Map<String, Object> delete(String publicId) throws IOException {
        return (Map<String, Object>) cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
