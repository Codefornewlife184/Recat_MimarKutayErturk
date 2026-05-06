const EASTERN_ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function convertToEasternArabicDigits(str) {
  return String(str).replace(/[0-9]/g, (digit) => EASTERN_ARABIC_DIGITS[digit])
}

export function translateNumbers(text, locale) {
  if (locale !== 'ar') return text
  return convertToEasternArabicDigits(text)
}
