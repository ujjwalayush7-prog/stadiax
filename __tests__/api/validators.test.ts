/**
 * Unit tests for the chat API request validator.
 * Tests the validateChatRequest function covering all validation paths:
 * missing body, invalid message, empty message, length overflow,
 * invalid persona, invalid language, and valid requests.
 */

import { validateChatRequest } from '../../src/lib/validators';

describe('validateChatRequest', () => {
  it('rejects null body', () => {
    const result = validateChatRequest(null);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/JSON object/i);
  });

  it('rejects non-object body', () => {
    const result = validateChatRequest('string');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/JSON object/i);
  });

  it('rejects missing message field', () => {
    const result = validateChatRequest({ persona: 'fan' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/message/i);
  });

  it('rejects non-string message', () => {
    const result = validateChatRequest({ message: 123, persona: 'fan' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/message/i);
  });

  it('rejects empty (whitespace-only) message', () => {
    const result = validateChatRequest({ message: '   ', persona: 'fan' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  it('rejects message exceeding maximum length', () => {
    const longMessage = 'a'.repeat(501);
    const result = validateChatRequest({ message: longMessage, persona: 'fan' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/maximum length/i);
  });

  it('rejects missing persona', () => {
    const result = validateChatRequest({ message: 'Hello' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/persona/i);
  });

  it('rejects invalid persona value', () => {
    const result = validateChatRequest({ message: 'Hello', persona: 'admin' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/persona/i);
  });

  it('rejects invalid language code', () => {
    const result = validateChatRequest({
      message: 'Hello',
      persona: 'fan',
      language: 'xx',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/language/i);
  });

  it('accepts valid fan request without language', () => {
    const result = validateChatRequest({
      message: 'Where is my seat?',
      persona: 'fan',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts valid staff request with language', () => {
    const result = validateChatRequest({
      message: 'Gate 4 status',
      persona: 'staff',
      language: 'es',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts message at exactly maximum length', () => {
    const exactMessage = 'a'.repeat(500);
    const result = validateChatRequest({
      message: exactMessage,
      persona: 'fan',
    });
    expect(result.valid).toBe(true);
  });
});
