function formatCardNumber(input: string): string {
    // Remove any non-digit characters
    const digitsOnly = input.replace(/\D/g, '');

    // Group into chunks of 4 digits
    const formatted = digitsOnly.match(/.{1,3}/g)?.join('-') || '';

    return formatted;
}

function getName(input: string): string {
    return input.split(' ').at(-1);
}

function thoudsandsSeparator(input: number): string {
    const nfObject = new Intl.NumberFormat('en-US');
    return nfObject.format(input);
}

function formatPhoneNumber(input: string): string {
    if(!input) return input;
    // Remove any non-digit characters
    const digitsOnly = input.replace(/\D/g, '');

    // Format based on length
    if (digitsOnly.length === 10) {
        return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        return digitsOnly.replace(/1(\d{3})(\d{3})(\d{4})/, '1 ($1) $2-$3');
    } else {
        return input; // Return the original input if it doesn't match expected lengths
    }
}

function formatCurrency(input: number): string {
    return thoudsandsSeparator(input) + "đ";
}

export {
    formatCardNumber,
    getName,
    thoudsandsSeparator,
    formatPhoneNumber,
    formatCurrency
}
