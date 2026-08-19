export const formatVND = (value: number): string =>
    `${value.toLocaleString('vi-VN')}₫`;

export const formatPriceOrFree = (value: number): string =>
    value > 0 ? formatVND(value) : 'Miễn phí';