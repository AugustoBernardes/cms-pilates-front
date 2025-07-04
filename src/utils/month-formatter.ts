export const monthFormatter = (monthInput: string): string => {
    const [year, month] = monthInput.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });
}