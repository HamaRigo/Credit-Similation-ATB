package dev.atb.ocr.Service;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageConverter {

    // Convert HEIC to PNG
    public File convertHeicToPng(File heicFile) throws IOException {
        // Placeholder for actual HEIC to PNG conversion logic
        // You will need to use a library or system command to perform this conversion
        File pngFile = new File(heicFile.getAbsolutePath().replace(".heic", ".png"));
        // Perform the conversion here and save it to pngFile
        // Example using a system command (pseudo-code):
        // ProcessBuilder pb = new ProcessBuilder("heif-converter", heicFile.getAbsolutePath(), pngFile.getAbsolutePath());
        // pb.start().waitFor();
        return pngFile;
    }

    // Convert MultipartFile HEIC to PNG
    public File convertHeicToPng(MultipartFile heicFile) throws IOException {
        File tempFile = File.createTempFile("temp", ".heic");
        heicFile.transferTo(tempFile);
        return convertHeicToPng(tempFile);
    }

    // Convert JPG to PNG
    public File convertJpgToPng(File jpgFile) throws IOException {
        BufferedImage bufferedImage = ImageIO.read(jpgFile);
        File pngFile = new File(jpgFile.getAbsolutePath().replace(".jpg", ".png"));
        ImageIO.write(bufferedImage, "png", pngFile);
        return pngFile;
    }

    // Convert MultipartFile JPG to PNG
    public File convertJpgToPng(MultipartFile jpgFile) throws IOException {
        File tempFile = File.createTempFile("temp", ".jpg");
        jpgFile.transferTo(tempFile);
        return convertJpgToPng(tempFile);
    }

    // Convert PDF to PNG
    public File convertPdfToPng(File pdfFile) throws IOException {
        // Use Apache PDFBox to convert PDF to PNG
        try (org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.pdmodel.PDDocument.load(pdfFile)) {
            org.apache.pdfbox.rendering.PDFRenderer pdfRenderer = new org.apache.pdfbox.rendering.PDFRenderer(document);
            File pngFile = new File(pdfFile.getAbsolutePath().replace(".pdf", ".png"));
            BufferedImage bufferedImage = pdfRenderer.renderImageWithDPI(0, 300); // 300 DPI for high quality
            ImageIO.write(bufferedImage, "png", pngFile);
            return pngFile;
        }
    }

    // Convert MultipartFile PDF to PNG
    public File convertPdfToPng(MultipartFile pdfFile) throws IOException {
        File tempFile = File.createTempFile("temp", ".pdf");
        pdfFile.transferTo(tempFile);
        return convertPdfToPng(tempFile);
    }
}
