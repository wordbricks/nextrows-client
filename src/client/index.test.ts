import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextrowsClient } from './index';
import * as tokenApi from '../api/oauth2/token';

describe('NextrowsClient', () => {
    let client: NextrowsClient;
    const appKey = 'test-app-key';
    const appSecret = 'test-app-secret';

    beforeEach(() => {
        client = new NextrowsClient(appKey, appSecret, true);
        vi.restoreAllMocks();
    });

    it('should be instantiated with credentials', () => {
        expect(client).toBeInstanceOf(NextrowsClient);
    });

    it('should call issueAccessToken with correct credentials', async () => {
        const mockResponse: tokenApi.NextrowsOAuthTokenResponse = {
            expires_dt: '20230101000000',
            token_type: 'Bearer',
            token: 'test-token',
        };

        const spy = vi.spyOn(tokenApi, 'issueAccessToken').mockResolvedValue(mockResponse);

        const response = await client.issueAccessToken();

        expect(spy).toHaveBeenCalledWith({
            grant_type: 'client_credentials',
            appkey: appKey,
            secretkey: appSecret
        }, true);
        expect(response).toEqual(mockResponse);
    });
});
