import React, { useState } from 'react';

function Profile() {
    const [signature, setSignature] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignature(reader.result);  // Save the image data URL
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (signature) {
            const response = await fetch('/api/upload-signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ signature }),
            });

            if (response.ok) {
                alert('Signature uploaded successfully!');
            } else {
                alert('Failed to upload signature.');
            }
        }
    };

    return (
        <div>
            <h1>Upload Your Signature</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Signature</button>
        </div>
    );
}

export default Profile;
