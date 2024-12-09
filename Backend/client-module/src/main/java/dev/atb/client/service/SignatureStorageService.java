package dev.atb.client.service;


import dev.atb.models.Client;

import dev.atb.repo.ClientRepository;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Base64;
import java.util.Optional;

@Service
public class SignatureStorageService {

    private final ClientRepository clientRepository;

    @Autowired
    public SignatureStorageService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    /**
     * Adds or updates a signature for a client by encoding it to Base64.
     * @param clientCin The CIN (unique ID) of the client.
     * @param imagePath The path to the signature image.
     * @return A message indicating success or failure.
     */
    public String addOrUpdateSignature(String clientCin, String imagePath) {
        try {
            // Check if the image file exists
            File imageFile = new File(imagePath);
            if (!imageFile.exists()) {
                return "Image file does not exist at path: " + imagePath;
            }
            // Load image from the file system
            Mat image = Imgcodecs.imread(imagePath);
            if (image.empty()) {
                return "Failed to read image from path: " + imagePath;
            }

            // Encode image as Base64
            String base64Signature = Base64.getEncoder().encodeToString(imageToByteArray(image));

            // Retrieve client by CIN and update or save
            Client client = clientRepository.findById(clientCin)
                    .orElseThrow(() -> new RuntimeException("Client with CIN: " + clientCin + " not found."));
                client.setSignature(base64Signature);
                clientRepository.save(client);
                return "Signature successfully added/updated for client with CIN: " + clientCin;

        } catch (Exception e) {
            throw new RuntimeException("Error adding/updating signature for client", e);
        }
    }

    /**
     * Retrieves the stored Base64-encoded signature for a client.
     * @param clientCin The CIN (unique ID) of the client.
     * @return The Base64-encoded signature, or null if not found.
     */
    public String getSignature(String clientCin) {
        return clientRepository.findById(clientCin)
                .map(Client::getSignature)
                .orElseThrow(() -> new RuntimeException("Signature not found for client with CIN: " + clientCin));
    }

    // Helper Method to Convert Mat Image to Byte Array
    private byte[] imageToByteArray(Mat image) {
        MatOfByte buffer = new MatOfByte();
        Imgcodecs.imencode(".png", image, buffer);
        return buffer.toArray();
    }
}
