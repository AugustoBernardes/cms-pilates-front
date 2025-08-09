export const dateFormatter = (dateInput: string): string => {
    const [year, month, day] = dateInput.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
}