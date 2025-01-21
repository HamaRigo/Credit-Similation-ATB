package dev.atb.ocr.Service;

import dev.atb.dto.ClientDTO;
import dev.atb.ocr.exceptions.SignatureComparisonException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class SignatureService {

    private final RestTemplate restTemplate;

    @Value("${python.api.baseurl}")
    private String pythonApiBaseUrl;  // Externalized API base URL

    @Autowired
    public SignatureService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Upload signature to the Python service
    public String uploadSignature(byte[] imageBytes) {
        String uploadUrl = pythonApiBaseUrl + "/upload-signature";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Prepare the multipart request with the image
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return "signature.jpg"; // Specify your filename
    }
        });

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Make the POST request to upload the signature
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);

            // Check for successful response
            if (response.getStatusCode().is2xxSuccessful()) {
        return response.getBody();
            } else {
                // Handle non-2xx HTTP response codes
                return "Error: " + response.getStatusCodeValue();
            }
        } catch (Exception e) {
            // Handle exceptions (e.g., network issues)
            return "Error: " + e.getMessage();
        }
    }

    // Compare uploaded signature with stored signature
    public String compareSignatures(byte[] uploadedSignatureBytes) {
        String compareUrl = pythonApiBaseUrl + "/compare-signatures";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Prepare the multipart request with the image
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(uploadedSignatureBytes) {
            @Override
            public String getFilename() {
                return "signature_to_compare.jpg"; // Specify your filename
            }
        });

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Make the POST request to compare signatures
        ResponseEntity<String> response = restTemplate.exchange(compareUrl, HttpMethod.POST, entity, String.class);

            // Check for successful response
            if (response.getStatusCode().is2xxSuccessful()) {
        return response.getBody();
            } else {
                // Handle non-2xx HTTP response codes
                return "Error: " + response.getStatusCodeValue();
            }
        } catch (Exception e) {
            // Handle exceptions (e.g., network issues)
            return "Error: " + e.getMessage();
        }
    }

    // Fetch client by account number (simulated)
    private ClientDTO fetchClientByNumeroCompte(String numeroCompte) {
        // Replace with actual logic to retrieve client from the database
        ClientDTO client = new ClientDTO();
        client.setSignature("base64_signature_example");  // Example signature
        return client;
    }
}
