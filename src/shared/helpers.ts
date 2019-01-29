export function ValidUUID (uuid: string): boolean {
    // RegEx for v4 postgres UUID
    // from https://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid#19989922
    let validUUID = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    return validUUID.test(uuid);
}
