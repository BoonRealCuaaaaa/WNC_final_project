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

export {
    formatCardNumber,
    getName,
    thoudsandsSeparator
}
