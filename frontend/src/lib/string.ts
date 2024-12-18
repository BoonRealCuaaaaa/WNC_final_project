function formatCardNumber(input: string): string {
    // Remove any non-digit characters
    const digitsOnly = input.replace(/\D/g, '');

    // Group into chunks of 4 digits
    const formatted = digitsOnly.match(/.{1,4}/g)?.join('-') || '';

    return formatted;
}

export {
    formatCardNumber
}