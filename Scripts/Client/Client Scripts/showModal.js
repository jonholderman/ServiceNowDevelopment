function showModal(modalTitle, modalMessage) {

    spModal.open({
        title: modalTitle,
        message: modalMessage,
        input: false,
        size: 'lg',
        buttons: [{
            label: 'OK',
            primary: true
        }],
    });
}

showModal("Warning", "You have been warned!");