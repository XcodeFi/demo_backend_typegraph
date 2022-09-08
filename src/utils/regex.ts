export function isVNPhoneNumber(text: string) {
    const PHONE_REGEX:RegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    if (PHONE_REGEX.test(text)) {
        return true;
    }

    return false;
}