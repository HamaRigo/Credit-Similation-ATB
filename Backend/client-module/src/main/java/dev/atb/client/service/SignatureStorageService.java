package dev.atb.client.service;

import dev.atb.models.Client;

import dev.atb.repo.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class SignatureStorageService {
    @Autowired
    private ClientRepository clientRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public File getSignatureFile(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        String signaturePath = client.getSignature();
        if (signaturePath == null || signaturePath.isEmpty()) {
            throw new RuntimeException("Signature not found for client " + clientId);
        }

        File signatureFile = new File(signaturePath);
        if (!signatureFile.exists()) {
            throw new RuntimeException("Signature file does not exist at " + signaturePath);
        }

        return signatureFile;
    }

    public Boolean addOrUpdateSignature(Long clientId, MultipartFile file) {
        try {
            // checks upload directory exists
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Save file
            String fileName = "signature_" + clientId + "_" + System.currentTimeMillis() + ".png";
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());

            // update signature in database
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));

            deleteSignatureFile(client.getSignature());
            client.setSignature(filePath.toString());
            clientRepository.save(client);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Could not store signature", e);
        }
    }

    public void deleteSignature(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        boolean isDeleted = deleteSignatureFile(client.getSignature());
        if (isDeleted) {
            client.setSignature("");
            clientRepository.save(client);
        }
    }

    public boolean deleteSignatureFile(String signaturePath) {
        if (signaturePath == null || signaturePath.isEmpty()) {
            return true;
        }

        try {
            Path filePath = Paths.get(signaturePath);
            return Files.deleteIfExists(filePath);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting signature file", e);
        }
    }
}
