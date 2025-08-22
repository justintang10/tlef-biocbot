document.addEventListener('DOMContentLoaded', () => {
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetSettingsBtn = document.getElementById('reset-settings');
    const deleteCollectionBtn = document.getElementById('delete-collection');
    
    // Default settings - simplified to placeholder
    const defaultSettings = {
        // Placeholder for future settings
    };
    
    // Handle save button click
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            // Placeholder for saving settings
            console.log('Save settings button clicked - functionality to be implemented');
            
            // Show success message
            showNotification('Settings functionality will be implemented', 'info');
        });
    }
    
    // Handle reset button click
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            // Placeholder for resetting settings
            console.log('Reset settings button clicked - functionality to be implemented');
            
            // Show success message
            showNotification('Settings functionality will be implemented', 'info');
        });
    }

    // Handle delete collection button click
    if (deleteCollectionBtn) {
        deleteCollectionBtn.addEventListener('click', async () => {
            // Show confirmation dialog
            const confirmed = confirm(
                '⚠️ WARNING: This will permanently delete ALL BiocBot data!\n\n' +
                'This includes:\n' +
                '• Vector embeddings (Qdrant)\n' +
                '• Document metadata (MongoDB)\n' +
                '• Course information\n' +
                '• Questions and assessments\n' +
                '• Onboarding data\n\n' +
                'This action cannot be undone and will completely reset the system.\n\n' +
                'Are you absolutely sure you want to continue?'
            );

            if (!confirmed) {
                return;
            }

            try {
                // Disable button to prevent multiple clicks
                deleteCollectionBtn.disabled = true;
                deleteCollectionBtn.textContent = 'Deleting...';

                // Call API to delete all collections
                const response = await fetch('/api/qdrant/delete-all-collections', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(
                        `All data deleted successfully! Qdrant: ${result.data.qdrantDeletedCount}, MongoDB: ${result.data.mongoDeletedCount} documents removed.`, 
                        'success'
                    );
                } else {
                    showNotification(
                        `Failed to delete data: ${result.message || 'Unknown error'}`, 
                        'error'
                    );
                }

            } catch (error) {
                console.error('Error deleting data:', error);
                showNotification(
                    'Failed to delete data: Network or server error', 
                    'error'
                );
            } finally {
                // Re-enable button
                deleteCollectionBtn.disabled = false;
                deleteCollectionBtn.textContent = 'Delete All Data';
            }
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.classList.add('notification-container');
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('notification-close');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        notification.appendChild(closeBtn);
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}); 