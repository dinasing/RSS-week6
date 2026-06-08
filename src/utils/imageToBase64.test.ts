import { describe, expect, it } from 'vitest';

import { imageToBase64 } from './imageToBase64';

describe('imageToBase64', () => {
  it('converts a file to a base64 data URL', async () => {
    const file = new File(['hello'], 'photo.png', { type: 'image/png' });
    const result = await imageToBase64(file);

    expect(result.startsWith('data:image/png;base64,')).toBe(true);
  });
});
